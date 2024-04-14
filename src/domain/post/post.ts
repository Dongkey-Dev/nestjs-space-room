import { z } from 'zod';
import { BaseDomain } from '../base/baseDomain';
import { T_UUID } from 'src/util/uuid';
import {
  IPost,
  IPostList,
  anonymousProfile,
  postPersistenceSchema,
  postSchema,
} from './post.interface';
import { IUser, userSchema } from '../user/user.interface';
import { ISpaceMemberID } from '../spaceMemberID/spaceMemberID.interface';

export class PostList implements IPostList {
  spaceId: T_UUID;
  posts: IPost[];
  total: number;
  constructor(posts: IPost[]) {
    if (
      posts.some((post) => post.getSpaceId() !== posts[0].getSpaceId()) ||
      posts.length === 0
    ) {
      throw new Error('All posts should have the same spaceId');
    }
    this.spaceId = posts[0].getSpaceId();
    this.posts = posts;
    this.total = posts.length;
  }
  private rankPosts(): void {
    /**
     * sort posts by ranking
     * 1. 게시글 작성자를 제외한 총 댓글 수
     * 2. 댓글에 참여한 유저 수
     */
    this.posts = this.posts.sort((a, b) => {
      const totalCommentsA = a.getTotalChats() || 0;
      const totalCommentsB = b.getTotalChats() || 0;
      if (totalCommentsA !== totalCommentsB) {
        return totalCommentsB - totalCommentsA;
      }

      const totalParticipantsA = a.getTotalParticipants() || 0;
      const totalParticipantsB = b.getTotalParticipants() || 0;
      return totalParticipantsB - totalParticipantsA;
    });

    // 순위 설정
    this.posts.forEach((post, index) => {
      post.setRanking(index + 1);
    });
  }

  getPosts(): IPost[] {
    this.rankPosts();
    return this.posts;
  }

  exportPosts(): {
    id?: Buffer;
    type?: string;
    spaceId?: Buffer;
    title?: string;
    totalComments?: number;
    ranking?: number;
  }[] {
    const posts = this.getPosts();
    return posts.map((post) => {
      return {
        id: post.getId().exportBuffer(),
        type: post.getType(),
        spaceId: post.getSpaceId().exportBuffer(),
        title: post.getTitle(),
        totalComments: post.getTotalChats(),
        ranking: post.getRanking(),
      };
    });
  }
}

export class Post extends BaseDomain<typeof postSchema> implements IPost {
  private id: T_UUID;
  private type: string;
  private spaceId: T_UUID;
  private isAnonymous: boolean;
  private title: string;
  private content: string;
  private authorId: T_UUID;
  private author?: IUser;
  private createdAt: Date;
  private updatedAt: Date;

  private totalComments?: number = 0;
  private totalParticipants?: number = 0;
  private ranking?: number;
  constructor(data?: z.input<typeof postSchema>) {
    super(postSchema);
    if (data) this.import(data);
    if (!this.id) this.id = new T_UUID();
  }
  exportResponseData(memberId: ISpaceMemberID): {
    id?: T_UUID;
    type?: string;
    spaceId?: T_UUID;
    isAnonymous?: boolean;
    title?: string;
    content?: string;
    authorLastName?: string;
    authorFirstName?: string;
    authorProfileImage?: string;
    createdAt?: Date;
    updatedAt?: Date;
  } {
    if (
      this.isAnonymous &&
      !(
        memberId.isAdmin(this.spaceId) ||
        this.authorId.isEqual(memberId.getUserId())
      )
    ) {
      return {
        id: this.id,
        type: this.type,
        spaceId: this.spaceId,
        isAnonymous: true,
        title: this.title,
        content: this.content,
        authorLastName: 'Anonymous',
        authorFirstName: 'Anonymouss',
        authorProfileImage: 'Anonymous.png',
        createdAt: this.createdAt,
        updatedAt: this.updatedAt,
      };
    }
    return {
      id: this.id,
      type: this.type,
      spaceId: this.spaceId,
      isAnonymous: this.isAnonymous,
      title: this.title,
      content: this.content,
      authorLastName: this.author.getProfile().lastName,
      authorFirstName: this.author.getProfile().firstName,
      authorProfileImage: this.author.getProfile().profileImage,
      createdAt: this.createdAt,
      updatedAt: this.updatedAt,
    };
  }
  isTobeRemove(): boolean {
    if (this.changes.exportToBeRemoved()) return true;
    return false;
  }
  setTobeRemove(memberId: ISpaceMemberID): void {
    if (
      this.authorId.isEqual(memberId.getUserId()) ||
      memberId.isAdmin(this.spaceId)
    ) {
      this.changes.setToBeRemoved({ id: this.id });
    }
    throw new Error('Only author or admin can remove post');
  }
  setAnonymous(): void {
    this.isAnonymous = true;
  }
  changeTitle(requester: T_UUID, title: string): boolean {
    if (!title) return true;
    if (requester.isEqual(this.authorId)) {
      this.title = title;
      return true;
    }
    throw new Error('Only author can change title');
  }
  changeContent(requester: T_UUID, content: string): boolean {
    if (!content) return true;
    if (requester.isEqual(this.authorId)) {
      this.content = content;
      return true;
    }
    throw new Error('Only author can change content');
  }
  setTitle(title: string): void {
    if (this.title) throw new Error('Title is already set');
    this.title = title;
  }
  setContent(content: string): void {
    if (this.content) throw new Error('Content is already set');
    this.content = content;
  }
  exportPostData(): z.infer<typeof postPersistenceSchema> {
    return postPersistenceSchema.parse(this.exportPersistence());
  }
  getSpaceId(): T_UUID {
    return this.spaceId;
  }
  setTotalChats(totalComments: number): boolean {
    this.totalComments = totalComments;
    return true;
  }
  setTotalParticipants(totalParticipants: number): boolean {
    this.totalParticipants = totalParticipants;
    return true;
  }
  getTotalChats(): number {
    return this.totalComments;
  }
  getTotalParticipants(): number {
    return this.totalParticipants;
  }
  getContent(): string {
    return this.content;
  }
  setAuthor(author: IUser): boolean {
    if (this.author) throw new Error('Author is already set');
    this.author = author;
    return true;
  }
  getAuthorId(): T_UUID {
    return this.authorId;
  }
  getAuthorProfile(requester: ISpaceMemberID): z.infer<typeof userSchema> {
    if (this.isAnonymous && !requester.isAdmin(this.spaceId))
      return anonymousProfile;
    return this.author.getProfile();
  }
  getCreatedAt(): Date {
    return this.createdAt;
  }
  getUpdatedAt(): Date {
    return this.updatedAt;
  }
  getId(): T_UUID {
    return this.id;
  }
  getType(): string {
    return this.type;
  }
  getTitle(): string {
    return this.title;
  }
  changeTypeNotice(spaceMember: ISpaceMemberID): boolean {
    if (spaceMember.isAdmin(this.spaceId)) {
      this.type = 'notice';
      return true;
    }
    throw new Error('Only admin can change post type');
  }
  setRanking(ranking: number): boolean {
    this.ranking = ranking;
    return true;
  }

  getRanking(): number {
    return this.ranking;
  }
}
