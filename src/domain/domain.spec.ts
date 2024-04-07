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

export interface ICommentManager {
  createComment(
    writer: IUser,
    content: string,
    isAnonymous?: boolean,
    parentComment?: IComment,
  ): boolean;
  getComment(id: T_UUID): IComment;
  getComments(post: IPost): IComment[];
  applyComment(comment: IComment): boolean;
}

export interface ISpaceMemberManager {
  createMember(space: ISpace): ISpaceMember;
  getMembers(space: ISpace): ISpaceMember[];
  getMembers(user: IUser): ISpaceMember[];
  applyMember(member: ISpaceMember): boolean;
}

export interface IUser {
  getId(): T_UUID;
  getProfile(requester?: T_UUID): z.infer<typeof profileSchema>;
  setProfile(profile: z.infer<typeof updateProfileSchema>): boolean;
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
  changeTypeNotice(
    spaceMember: ISpaceMember,
    spaceRole: ISpaceRole,
    requester: T_UUID,
  ): boolean;
  getTitle(): string;
  getContent(): string;
  getAuthorId(): T_UUID;
  getAuthorProfile(requester: ISpaceMemberID): z.infer<typeof profileSchema>;
  getCreatedAt(): Date;
  getUpdatedAt(): Date;

  setRanking(ranking: number): boolean;
}

export interface IPostList {
  getPopularPosts(): IPost[];
}

export interface ISpaceMemberID {
  isOwner(spaceId: T_UUID): boolean;
  isAdmin(spaceId: T_UUID): boolean;
  isMember(spaceId: T_UUID): boolean;
  getUserId(): T_UUID;
}

export interface IComment {
  getContent(): string;
  writeContent(content: string): boolean;
  writeReply(requester: T_UUID, comment: IComment): boolean;
  getReplies(requester: T_UUID): IComment[];
  writeReply(requester: T_UUID, reply: IComment): boolean;
  deleteReply(requester: T_UUID, reply: IComment | T_UUID): boolean;
}

describe('domain', () => {
  it('test', () => {
    expect(true).toBeTruthy();
  });
});
