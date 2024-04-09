import { z } from 'zod';
import { BaseDomain } from '../base/baseDomain';
import { T_UUID } from 'src/util/uuid';
import {
  IPost,
  IPostList,
  anonymousProfile,
  postSchema,
  postType,
} from './post.interface';
import { IUser, userSchema } from '../user/user.interface';
import { ISpaceMemberID } from '../spaceMemberID/spaceMemberID.interface';

export class PostList implements IPostList {
  spaceId: T_UUID;
  posts: IPost[];
  total: number;
  constructor(posts: IPost[]) {
    // 입력받은 posts의 모든 인자의 spaceId가 동일한지 확인하고, 동일하지 않다면 에러 발생
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
}

export class Post
  extends BaseDomain<typeof postSchema>
  implements BaseDomain<typeof postSchema>, IPost
{
  private id: T_UUID;
  private type: z.infer<typeof postType> = 'question';
  private spaceId: T_UUID;
  private isAnon: boolean;
  private title: string;
  private content: string;
  private authorId: T_UUID;
  private author?: IUser;
  private createdAt: Date;
  private updatedAt: Date;

  private totalComments?: number = 0;
  private totalParticipants?: number = 0;
  private ranking?: number;
  constructor(data: z.input<typeof postSchema>) {
    super(postSchema);
    this.import(data);
    if (!this.id) this.id = new T_UUID();
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
    if (this.isAnon && !requester.isAdmin(this.spaceId))
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
  getType(): 'notice' | 'question' {
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
