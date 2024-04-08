import { z } from 'zod';
import { IUUIDTransable, T_UUID } from 'src/util/uuid';

export const permissionEnum = z.enum(['owner', 'admin', 'member']);

export const userSchema = z.object({
  id: z.custom<IUUIDTransable>().transform((val) => new T_UUID(val)),
  email: z.string().email(),
  lastName: z.string(),
  firstName: z.string(),
  profileImage: z.string().url(),
});

export const profileSchema = z.object({
  email: z.string().email().optional(),
  lastName: z.string(),
  firstName: z.string(),
  profileImage: z.string().url(),
});

export const anonymousProfileSchema = z.object({
  lastName: z.string().default('anonymous'),
  firstName: z.string().default('anonymous'),
  profileImage: z.string().url().default('anonymous.png'),
});

export const updateProfileSchema = z.object({
  lastName: z.string().optional(),
  firstName: z.string().optional(),
  profileImage: z.string().url().optional(),
});

export const spaceEnterCodeSchema = z.object({
  adminCode: z.string().min(8).max(8),
  memberCode: z.string().min(8).max(8),
});

export interface IUserManager {
  createUser(email: string): IUser;
  getUser(id: T_UUID): IUser;
  applyUser(user: IUser): boolean;
}

export interface ISpaceManager {
  createSpace(space: ISpace): boolean;
  getSpace(id: T_UUID): ISpace;
  applySpace(space: ISpace): boolean;
}

export interface ISpaceRoleManager {
  createRole(roleName: string, permission: 'admin' | 'user'): ISpaceRole;
  applyRole(role: ISpaceRole): boolean;
  getRole(user: IUser): ISpaceRole;
}

export interface IPostManager {
  createPost(writer: IUser, content: string, isAnonymous?: boolean): IPost;
  getPosts(space: ISpace): IPost[];
  deletePost(post: IPost): boolean;
}

export interface IChatManager {
  createChat(
    writer: IUser,
    content: string,
    isAnonymous?: boolean,
    parentChat?: IChat,
  ): boolean;
  getChat(id: T_UUID): IChat;
  getChats(post: IPost): IChat[];
  applyChat(chat: IChat): boolean;
}

export interface ISpaceMemberManager {
  createMember(space: ISpace): ISpaceMember;
  getMembers(space: ISpace): ISpaceMember[];
  getMembers(user: IUser): ISpaceMember[];
  applyMember(member: ISpaceMember): boolean;
}

export interface IUser {
  getId(): T_UUID;
  getProfile(requester?: T_UUID);
  getAnonymousProfile(): z.infer<typeof anonymousProfileSchema>;
  setProfile(
    profile: z.infer<typeof updateProfileSchema>,
    requester: T_UUID,
  ): boolean;
}

export interface ISpaceMember {
  getUserId(): T_UUID;
  setUserId(userId: T_UUID): boolean;
  getRoleId(): T_UUID;
  setRoleId(roleId: T_UUID): boolean;
  getSpaceId(): T_UUID;

  changeRole(
    requesterId: T_UUID,
    ownerMember: ISpaceMember,
    role: ISpaceRole,
  ): boolean;
}

export interface ISpace {
  getId(): T_UUID;
  getName(): string;
  changeName(name: string, ownerMember: ISpaceMember): boolean;
  getLogo(): string;
  changeLogo(logo: string, ownerMember: ISpaceMember): boolean;

  getOwnerId(): T_UUID;
  changeOwner(
    oldOwnerMember: ISpaceMember,
    newOwnerMember: ISpaceMember,
  ): boolean;
}

export interface ISpaceRole {
  getId(): T_UUID;
  getSpaceId(): T_UUID;
  getRole(): string;
  getPermission(): z.infer<typeof permissionEnum>;
}

export interface IPost {
  getId(): T_UUID;
  getType(): 'notice' | 'question';
  getSpaceId(): T_UUID;
  changeTypeNotice(spaceMember: ISpaceMemberID): boolean;
  getTitle(): string;
  getContent(): string;
  getCreatedAt(): Date;
  getUpdatedAt(): Date;

  setAuthor(author: IUser): boolean;
  getAuthorId(): T_UUID;
  getAuthorProfile(requester: ISpaceMemberID): z.infer<typeof profileSchema>;

  getTotalChats(): number;
  setTotalChats(totalChats: number): boolean;
  getTotalParticipants(): number;
  setTotalParticipants(totalParticipants: number): boolean;
  setRanking(ranking: number): boolean;
  getRanking(): number;
}

export interface IPostList {
  getPosts(): IPost[];
}

export interface ISpaceMemberID {
  isOwner(spaceId: T_UUID): boolean;
  isAdmin(spaceId: T_UUID): boolean;
  isMember(spaceId: T_UUID): boolean;
  getUserId(): T_UUID;
}

export interface IChat {
  getId(): T_UUID;
  getPrevChatId(): T_UUID | false;
  getContent(memberID: ISpaceMemberID);
  setAuthor(user: IUser): boolean;
  setReply(chat: IChat): void;
  getPostId(): T_UUID;
  writeReply(memberID: ISpaceMemberID, chat: IChat): boolean;
  deleteChat(memberID: ISpaceMemberID): boolean;
}

describe('domain', () => {
  it('test', () => {
    expect(true).toBeTruthy();
  });
});
