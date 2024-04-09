import { T_UUID } from 'src/util/uuid';
import { ISpaceMemberID } from '../spaceMemberID/spaceMemberID.interface';
import { IUser, profileSchema } from '../user/user.interface';
import { z } from 'zod';
import { Post, PostList } from './post';
import { IPost } from './post.interface';

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
  login(password: string): boolean {
    throw new Error('Method not implemented.');
  }
  keepPassword(password: string): void {
    throw new Error('Method not implemented.');
  }
  popPassword(): string {
    throw new Error('Method not implemented.');
  }
  setProfile(profile: {
    id?: T_UUID;
    email?: string;
    lastName?: string;
    firstName?: string;
    profileImage?: string;
  }): boolean {
    this.email = profile.email || this.email;
    this.lastName = profile.lastName || this.lastName;
    this.firstName = profile.firstName || this.firstName;
    this.profileImage = profile.profileImage || this.profileImage;
    return true;
  }
  getAnonymousProfile(): {
    lastName?: string;
    firstName?: string;
    profileImage?: string;
  } {
    throw new Error('Method not implemented.');
  }
  getId(): T_UUID {
    throw new Error('Method not implemented.');
  }
  updateProfile(profile: {
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
    expect(post.getTotalChats()).toEqual(0);
    expect(post.getTotalParticipants()).toEqual(0);
    post.setTotalChats(10);
    post.setTotalParticipants(5);
    expect(post.getTotalChats()).toEqual(10);
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

class MockPost implements IPost {
  private id: T_UUID;
  private type: 'notice' | 'question' = 'question';
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
  constructor(
    spaceId: T_UUID,
    isAnon: boolean,
    title: string,
    content: string,
    authorId: T_UUID,
    totalComments: number = 0,
    totalParticipants: number = 0,
  ) {
    this.id = new T_UUID();
    this.spaceId = spaceId;
    this.isAnon = isAnon;
    this.title = title;
    this.content = content;
    this.authorId = authorId;
    this.createdAt = new Date();
    this.updatedAt = new Date();
    this.totalComments = totalComments;
    this.totalParticipants = totalParticipants;
  }
  setRanking(ranking: number): boolean {
    this.ranking = ranking;
    return true;
  }
  getRanking(): number {
    throw new Error('Method not implemented.');
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
  getAuthorProfile(requester: ISpaceMemberID): z.infer<typeof profileSchema> {
    throw new Error('Method not implemented.');
  }
  getCreatedAt(): Date {
    throw new Error('Method not implemented.');
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
    throw new Error('Method not implemented.');
  }
}

describe('PostList', () => {
  let wrongPostList: PostList;
  let postList: PostList;
  const postId = new T_UUID();
  const posts = [
    new MockPost(postId, false, 'test', 'test', new T_UUID(), 8, 4),
    new MockPost(postId, false, 'test', 'test', new T_UUID(), 10, 5),
    new MockPost(postId, false, 'test', 'test', new T_UUID(), 10, 4),
  ];
  const wrongPosts = [
    new MockPost(new T_UUID(), false, 'test', 'test', new T_UUID(), 10, 5),
    new MockPost(new T_UUID(), false, 'test', 'test', new T_UUID(), 10, 4),
    new MockPost(new T_UUID(), false, 'test', 'test', new T_UUID(), 8, 4),
  ];

  beforeEach(() => {
    postList = new PostList(posts);
  });

  it('생성 확인', () => {
    expect(postList).toBeTruthy();
  });

  it('서로 다른 posts는 PostList가 될 수 없다.', () => {
    expect(() => (wrongPostList = new PostList(wrongPosts))).toThrow();
  });

  it('게시글 rank를 매겼을 때, 순서 확인', () => {
    const rankedPosts = postList.getPosts();
    expect(rankedPosts[0].getTotalChats()).toEqual(10);
    expect(rankedPosts[0].getTotalParticipants()).toEqual(5);
    expect(rankedPosts[1].getTotalChats()).toEqual(10);
    expect(rankedPosts[1].getTotalParticipants()).toEqual(4);
    expect(rankedPosts[2].getTotalChats()).toEqual(8);
    expect(rankedPosts[2].getTotalParticipants()).toEqual(4);
  });
});
