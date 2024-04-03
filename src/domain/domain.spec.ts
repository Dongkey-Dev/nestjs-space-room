import { z } from 'zod';
import { DomainManager } from './base/domainManager';
import { IUUIDTransable, T_UUID } from 'src/util/uuid';

export const roleEnum = z.enum(['owner', 'admin', 'member']);

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

export interface IUser {
  getId(): T_UUID;
  getProfile(requester?: T_UUID): z.infer<typeof profileSchema>;
  setProfile(profile: z.infer<typeof updateProfileSchema>): void;
  getJoiningSpaces(): Promise<ISpace[]>;
  createSpace(): Promise<ISpace>;
  setSpaceManager(manager: DomainManager<ISpace>): void;
}

export interface ISpace {
  joinSpace(user: IUser, code: string): void;
  setOwner(owner: IUser): void;
  getInviteCode(role: 'admin' | 'member'): string;
  getPosts(requester: T_UUID): IPost[];
  writePost(requester: T_UUID, post: IPost): void;
  deletePost(requester: T_UUID, post: IPost | T_UUID): void;
  createRole(requester: T_UUID, role: ISpaceRole): void;
  removeRole(requester: T_UUID, role: ISpaceRole): void;
  changeRole(requester: T_UUID, role: ISpaceRole): void;
  changeOwner(requester: T_UUID, user: IUser): void;
}

export interface ISpaceRole {}

export interface IPost {
  getComments(requester: T_UUID): IComment[];
  writeComment(requester: T_UUID, comment: IComment): void;
  deleteComment(requester: T_UUID, comment: IComment | T_UUID): void;
}

interface IComment {}
