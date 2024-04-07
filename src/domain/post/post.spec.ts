import { z } from 'zod';
import { BaseDomain } from '../base/baseDomain';
import { IUUIDTransable, T_UUID } from 'src/util/uuid';
import {
  IPost,
  IPostList,
  ISpaceMember,
  ISpaceMemberID,
  ISpaceRole,
  IUser,
  permissionEnum,
  profileSchema,
  userSchema,
} from '../domain.spec';
import { adminEnum } from '../spaceRole/spaceRole.spec';
import exp from 'constants';

export const postType = z.enum(['notice', 'question']).default('question');
export const anonymousProfile: z.infer<typeof profileSchema> = {
  lastName: 'anonymous',
  firstName: 'anonymous',
  profileImage: 'anonymous.png',
};
export const postSchema = z.object({
  type: postType,
  spaceId: z.custom<IUUIDTransable>().transform((val) => new T_UUID(val)),
  isAnon: z.boolean(),
  title: z.string(),
  content: z.string(),
  authorId: z.custom<IUUIDTransable>().transform((val) => new T_UUID(val)),
  author: userSchema.optional(),
  totalComments: z.number().default(0),
  totalParticipants: z.number().default(0),
  ranking: z.number().default(0),
  createdAt: z.date(),
  updatedAt: z.date(),
});

export class PostList implements IPostList {
  spaceId: T_UUID;
  posts: IPost[];
  total: number;
  constructor(posts: IPost[]) {
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
      const totalCommentsA = a.getTotalComments() || 0;
      const totalCommentsB = b.getTotalComments() || 0;
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
    this.id = new T_UUID();
  }
  setTotalComments(totalComments: number): boolean {
    this.totalComments = totalComments;
    return true;
  }
  setTotalParticipants(totalParticipants: number): boolean {
    this.totalParticipants = totalParticipants;
    return true;
  }
  getTotalComments(): number {
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

class MockOwnerID implements ISpaceMemberID {
  userId: T_UUID;
  spaceId: T_UUID;
  constructor(userId: T_UUID, spaceId: T_UUID) {
    this.userId = userId;
    this.spaceId = spaceId;
  }
  isAdmin(spaceId: T_UUID): boolean {
    return true;
  }
  isMember(spaceId: T_UUID): boolean {
    return true;
  }
  isOwner(spaceId: T_UUID): boolean {
    return true;
  }
  getUserId(): T_UUID {
    return this.userId;
  }
}

class MockAdminID implements ISpaceMemberID {
  userId: T_UUID;
  spaceId: T_UUID;
  constructor(userId: T_UUID, spaceId: T_UUID) {
    this.userId = userId;
    this.spaceId = spaceId;
  }
  isAdmin(spaceId: T_UUID): boolean {
    return true;
  }
  isMember(spaceId: T_UUID): boolean {
    return true;
  }
  isOwner(spaceId: T_UUID): boolean {
    return false;
  }
  getUserId(): T_UUID {
    return this.userId;
  }
}

class MockMemberID implements ISpaceMemberID {
  userId: T_UUID;
  spaceId: T_UUID;
  constructor(userId: T_UUID, spaceId: T_UUID) {
    this.userId = userId;
    this.spaceId = spaceId;
  }
  isAdmin(spaceId: T_UUID): boolean {
    return false;
  }
  isMember(spaceId: T_UUID): boolean {
    return true;
  }
  isOwner(spaceId: T_UUID): boolean {
    return false;
  }
  getUserId(): T_UUID {
    return this.userId;
  }
}

class MockUser implements IUser {
  id: T_UUID;
  email: string;
  firstName: string;
  lastName: string;
  profileImage: string;
  constructor(
    email: string,
    firstName: string,
    lastName: string,
    profileImage: string,
  ) {
    this.id = new T_UUID();
    this.email = email;
    this.firstName = firstName;
    this.lastName = lastName;
    this.profileImage = profileImage;
  }
  getId(): T_UUID {
    throw new Error('Method not implemented.');
  }
  setProfile(profile: {
    lastName?: string;
    firstName?: string;
    profileImage?: string;
  }): boolean {
    throw new Error('Method not implemented.');
  }
  getProfile(): z.infer<typeof profileSchema> {
    return {
      firstName: this.firstName,
      lastName: this.lastName,
      profileImage: this.profileImage,
    };
  }
}

describe('Post', () => {
  let post: Post;
  const authorId = new T_UUID();
  const mockOwnerID = new MockOwnerID(new T_UUID(), new T_UUID());
  const mockAdminID = new MockAdminID(new T_UUID(), new T_UUID());
  const mockMemberID = new MockMemberID(new T_UUID(), new T_UUID());

  const mockUserData = {
    email: 'test@email.com',
    firstName: 'test',
    lastName: 'test',
    profileImage: 'test.png',
  };

  const mockUser = new MockUser(
    mockUserData.email,
    mockUserData.firstName,
    mockUserData.lastName,
    mockUserData.profileImage,
  );

  beforeEach(() => {
    post = new Post({
      type: 'question',
      spaceId: new T_UUID(),
      isAnon: false,
      title: 'test',
      content: 'test',
      authorId: authorId,
    });
  });

  it('생성 확인', () => {
    expect(post).toBeTruthy();
  });

  it('게시글 타입 설정 확인', () => {
    expect(post.getType()).toEqual('question');
  });

  it('게시글 댓글 설정 확인', () => {
    expect(post.getTotalComments()).toEqual(0);
    expect(post.getTotalParticipants()).toEqual(0);
    post.setTotalComments(10);
    post.setTotalParticipants(5);
    expect(post.getTotalComments()).toEqual(10);
    expect(post.getTotalParticipants()).toEqual(5);
  });

  it('게시글 순위 설정 확인', () => {
    post.setRanking(1);
    expect(post.getRanking()).toEqual(1);
  });

  it('게시글 삭제시 권한 확인', () => {
    expect(() => post.changeTypeNotice(mockMemberID)).toThrow(
      'Only admin can change post type',
    );
  });

  it('게시글 삭제시 권한 확인', () => {
    expect(post.changeTypeNotice(mockAdminID)).toBeTruthy();
  });

  it('게시글 삭제시 권한 확인', () => {
    expect(post.changeTypeNotice(mockOwnerID)).toBeTruthy();
  });

  it('공간 소유자 게시글 작성자 프로필 확인', () => {
    post.setAuthor(mockUser);
    const omitEmail = { ...mockUserData };
    delete omitEmail.email;
    expect(post.getAuthorProfile(mockOwnerID)).toEqual(omitEmail);
  });

  it('공간 관리자 게시글 작성자 프로필 확인', () => {
    post.setAuthor(mockUser);
    const omitEmail = { ...mockUserData };
    delete omitEmail.email;
    expect(post.getAuthorProfile(mockAdminID)).toEqual(omitEmail);
  });

  it('공간 멤버 게시글 작성자 프로필 확인', () => {
    post.setAuthor(mockUser);
    const omitEmail = { ...mockUserData };
    delete omitEmail.email;
    expect(post.getAuthorProfile(mockMemberID)).toEqual(omitEmail);
  });
});