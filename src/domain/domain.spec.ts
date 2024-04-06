import { z } from 'zod';
import { IUUIDTransable, T_UUID } from 'src/util/uuid';

export const roleEnum = z.enum(['admin', 'member']);

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
  getRole(): ISpaceRole;
  setRole(role: ISpaceRole): boolean;
  getPermissions(): string[];
  setPermissions(permissions: string[]): boolean;
  getSpace(): ISpace;
}

export interface ISpace {
  joinSpace(user: IUser, code: string): boolean;
  setOwner(owner: IUser): boolean;
  getInviteCode(role: 'admin' | 'member'): string;
}

export interface ISpaceRole {
  getRole(): string;
  setRole(role: string): boolean;
  getPermission(): z.infer<typeof roleEnum>;
  setPermission(permission: z.infer<typeof roleEnum>): boolean;
}

export interface IPost {
  getComments(requester: T_UUID): IComment[];
  writeComment(requester: T_UUID, comment: IComment): boolean;
  deleteComment(requester: T_UUID, comment: IComment | T_UUID): boolean;
}

export interface IComment {
  getContent(): string;
  writeContent(content: string): boolean;
  writeReply(requester: T_UUID, comment: IComment): boolean;
  getReplies(requester: T_UUID): IComment[];
  writeReply(requester: T_UUID, reply: IComment): boolean;
  deleteReply(requester: T_UUID, reply: IComment | T_UUID): boolean;
}
