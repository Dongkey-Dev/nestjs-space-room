import { T_UUID } from 'src/util/uuid';
import { IUser, userSchema } from '../user/user.interface';
import { Chat } from './chat';
import { ISpaceMemberID } from '../spaceMemberID/spaceMemberID.interface';
import { BaseDomain } from '../base/baseDomain';

class MockSpaceMember implements ISpaceMemberID {
  userId: T_UUID;
  spaceId: T_UUID;
  constructor(userId: T_UUID, spaceId: T_UUID) {
    this.userId = userId;
    this.spaceId = spaceId;
  }
  getUserId(): T_UUID {
    return this.userId;
  }
  isOwner(spaceId: T_UUID): boolean {
    return false;
  }
  isAdmin(spaceId: T_UUID): boolean {
    return false;
  }
  isMember(spaceId: T_UUID): boolean {
    if (this.spaceId.isEqual(spaceId)) return true;
    return false;
  }
}

class MockSpaceAdmin implements ISpaceMemberID {
  userId: T_UUID;
  spaceId: T_UUID;
  constructor(userId: T_UUID, spaceId: T_UUID) {
    this.userId = userId;
    this.spaceId = spaceId;
  }
  getUserId(): T_UUID {
    return this.userId;
  }
  isOwner(spaceId: T_UUID): boolean {
    return false;
  }
  isAdmin(spaceId: T_UUID): boolean {
    if (this.spaceId.isEqual(spaceId)) return true;
    return false;
  }
  isMember(spaceId: T_UUID): boolean {
    if (this.spaceId.isEqual(spaceId)) return true;
    return false;
  }
}

class MockUser extends BaseDomain<typeof userSchema> implements IUser {
  id: T_UUID;
  email: string;
  lastName: string;
  firstName: string;
  profileImage: string;

  constructor(id, email, lastName, firstName, profileImage) {
    super(userSchema);
    this.id = id;
    this.email = email;
    this.lastName = lastName;
    this.firstName = firstName;
    this.profileImage = profileImage;
  }
  login(password: string): Promise<boolean> {
    throw new Error('Method not implemented.');
  }

  keepPassword(password: string): void {
    throw new Error('Method not implemented.');
  }
  popPassword(): string | false {
    throw new Error('Method not implemented.');
  }
  setProfile(profile: {
    id?: T_UUID;
    email?: string;
    lastName?: string;
    firstName?: string;
    profileImage?: string;
  }): boolean {
    throw new Error('Method not implemented.');
  }

  getId(): T_UUID {
    return this.id;
  }
  getProfile(requester?: T_UUID) {
    return {
      lastName: this.lastName,
      firstName: this.firstName,
      profileImage: this.profileImage,
    };
  }
  getAnonymousProfile(): {
    lastName?: string;
    firstName?: string;
    profileImage?: string;
  } {
    return {
      lastName: 'anonymous',
      firstName: 'anonymous',
      profileImage: 'anonymous.png',
    };
  }
  updateProfile(
    profile: { lastName?: string; firstName?: string; profileImage?: string },
    requester: T_UUID,
  ): boolean {
    throw new Error('Method not implemented.');
  }
}

describe('chat', () => {
  const spaceId1 = new T_UUID();
  const spaceId2 = new T_UUID();
  const postId1 = new T_UUID();
  const postId2 = new T_UUID();
  let chat111: Chat;
  let user1: IUser;
  const adminID1 = new MockSpaceAdmin(new T_UUID(), spaceId1);
  const memberID1 = new MockSpaceMember(new T_UUID(), spaceId1);
  const memberID2 = new MockSpaceMember(new T_UUID(), spaceId2);

  beforeEach(() => {
    chat111 = new Chat({
      id: new T_UUID(),
      spaceId: spaceId1,
      authorId: memberID1.getUserId(),
      content: 'content',
      postId: postId1,
      isAnonymous: false,
    });
    user1 = new MockUser(
      memberID1.getUserId(),
      'test1@email.com',
      'test1',
      'test1',
      'test1.png',
    );
  });

  it('생성확인', () => {
    expect(chat111).toBeTruthy();
  });

  it('댓글 작성 확인', () => {
    const samePostChat = new Chat({
      id: new T_UUID(),
      spaceId: spaceId1,
      authorId: memberID1.getUserId(),
      content: 'content',
      postId: postId1,
      isAnonymous: false,
    });
    chat111.writeReply(memberID1, samePostChat);
    expect(samePostChat.getPrevChatId()).toEqual(chat111.getId());
  });

  it('postId가 다른 댓글엔 답글이 불가능하다.', () => {
    const anotherPostChat = new Chat({
      id: new T_UUID(),
      spaceId: spaceId1,
      authorId: memberID1.getUserId(),
      content: 'content',
      postId: postId2,
      isAnonymous: false,
    });
    expect(() => chat111.writeReply(memberID2, anotherPostChat)).toThrow();
  });

  it('멤버가 아닌 사용자는 댓글을 달 수 없다.', () => {
    const notMembered = new MockSpaceMember(new T_UUID(), spaceId2);
    const chat2 = new Chat({
      id: new T_UUID(),
      spaceId: spaceId1,
      authorId: memberID1.getUserId(),
      content: 'content',
      postId: postId2,
      isAnonymous: false,
    });
    expect(() => chat111.writeReply(notMembered, chat2)).toThrow();
  });

  it('댓글 삭제 확인', () => {
    chat111.setAuthor(user1);
    expect(chat111.deleteChat(memberID1)).toBeTruthy();
  });

  it('관리자가 아닌 사용자는 댓글을 삭제할 수 없다.', () => {
    expect(() => chat111.deleteChat(memberID2)).toThrow();
  });

  it('관리자는 댓글을 삭제할 수 있다.', () => {
    expect(chat111.deleteChat(adminID1)).toBeTruthy();
  });

  it('댓글 내용 확인', () => {
    chat111.setAuthor(user1);
    const omitEmail = chat111.exportJson();
    delete omitEmail.author.email;
    expect(chat111.getContent(memberID1)).toEqual(omitEmail);
  });

  it('익명 댓글 확인', () => {
    const anonChat = new Chat({
      id: new T_UUID(),
      spaceId: spaceId1,
      authorId: memberID1.getUserId(),
      content: 'content',
      postId: postId1,
      isAnonymous: true,
    });
    anonChat.setAuthor(user1);
    const anonymousChat = anonChat.getContent(memberID2);
    expect(anonymousChat.author).toEqual({
      lastName: 'anonymous',
      firstName: 'anonymous',
      profileImage: 'anonymous.png',
    });
  });

  it('본인의 익명 댓글 확인', () => {
    const anonChat = new Chat({
      id: new T_UUID(),
      spaceId: spaceId1,
      authorId: memberID1.getUserId(),
      content: 'content',
      postId: postId1,
      isAnonymous: true,
    });
    anonChat.setAuthor(user1);
    const anonymousChat = anonChat.getContent(memberID1);
    const omitEmailId = user1.getProfile();
    delete omitEmailId.email;
    omitEmailId.id = user1.getId().exportString();

    expect(anonymousChat.author).toEqual(omitEmailId);
  });

  it('관리자는 모든 댓글을 확인할 수 있다.', () => {
    const anonChat = new Chat({
      id: new T_UUID(),
      spaceId: spaceId1,
      authorId: memberID1.getUserId(),
      content: 'content',
      postId: postId1,
      isAnonymous: true,
    });
    anonChat.setAuthor(user1);
    const anonymousChat = anonChat.getContent(adminID1);
    const userProfile = user1.getProfile();
    userProfile.id = user1.getId().exportString();
    delete userProfile.email;
    expect(anonymousChat.author).toEqual(userProfile);
  });

  it('댓글 수정 확인', () => {
    chat111.setAuthor(user1);
    const newContent = 'new content';
    chat111.changeContent(memberID1, newContent);
    expect(chat111.exportJson().content).toEqual(newContent);
  });

  it('멤버가 아닌 사용자는 댓글을 수정할 수 없다.', () => {
    expect(() => chat111.changeContent(memberID2, 'new content')).toThrow();
  });

  it('본인이 아닌 사용자는 댓글을 수정할 수 없다.', () => {
    expect(() =>
      chat111.changeContent(
        new MockSpaceMember(new T_UUID(), spaceId1),
        'new content',
      ),
    ).toThrow();
  });

  it('익명 댓글은 본인만 수정할 수 있다.', () => {
    const anonChat = new Chat({
      id: new T_UUID(),
      spaceId: spaceId1,
      authorId: memberID1.getUserId(),
      content: 'content',
      postId: postId1,
      isAnonymous: true,
    });
    anonChat.setAuthor(user1);
    expect(() =>
      anonChat.changeContent(memberID1, 'new content'),
    ).not.toThrow();
  });

  it('익명 댓글은 본인이 아닌 사용자는 수정할 수 없다.', () => {
    const anonChat = new Chat({
      id: new T_UUID(),
      spaceId: spaceId1,
      authorId: memberID1.getUserId(),
      content: 'content',
      postId: postId1,
      isAnonymous: true,
    });
    anonChat.setAuthor(user1);
    expect(() => anonChat.changeContent(memberID2, 'new content')).toThrow();
  });

  it('익명 댓글은 관리자가 수정할 수 없다.', () => {
    const anonChat = new Chat({
      id: new T_UUID(),
      spaceId: spaceId1,
      authorId: memberID1.getUserId(),
      content: 'content',
      postId: postId1,
      isAnonymous: true,
    });
    anonChat.setAuthor(user1);
    expect(() => anonChat.changeContent(adminID1, 'new content')).toThrow();
  });
});
