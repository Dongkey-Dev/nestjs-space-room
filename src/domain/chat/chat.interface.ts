import { IUUIDTransable, T_UUID } from 'src/util/uuid';
import { z } from 'zod';
import { IUser, userSchema } from '../user/user.interface';
import { ISpaceMemberID } from '../spaceMemberID/spaceMemberID.interface';

export const chatSchema = z.object({
  id: z.custom<IUUIDTransable>().transform((val) => new T_UUID(val)),
  spaceId: z.custom<IUUIDTransable>().transform((val) => new T_UUID(val)),
  authorId: z.custom<IUUIDTransable>().transform((val) => new T_UUID(val)),
  postId: z.custom<IUUIDTransable>().transform((val) => new T_UUID(val)),
  content: z.string(),
  prevChatId: z
    .custom<IUUIDTransable>()
    .transform((val) => new T_UUID(val))
    .optional(),
  isAnonymous: z.boolean(),
  author: userSchema.optional(),

  createdAt: z.date().optional(),
  updatedAt: z.date().optional(),
});

export const chatPersistenceSchema = z.object({
  id: z
    .custom<IUUIDTransable>()
    .transform((val) => new T_UUID(val).exportBuffer()),
  spaceId: z
    .custom<IUUIDTransable>()
    .transform((val) => new T_UUID(val).exportBuffer()),
  authorId: z
    .custom<IUUIDTransable>()
    .transform((val) => new T_UUID(val).exportBuffer()),
  postId: z
    .custom<IUUIDTransable>()
    .transform((val) => new T_UUID(val).exportBuffer()),
  content: z.string(),
  prevChatId: z
    .custom<IUUIDTransable>()
    .transform((val) => new T_UUID(val).exportBuffer())
    .optional(),
  isAnonymous: z.boolean(),
});

export const chatResponseSchema = z.object({
  id: z
    .custom<IUUIDTransable>()
    .transform((val) => new T_UUID(val).exportString()),
  spaceId: z
    .custom<IUUIDTransable>()
    .transform((val) => new T_UUID(val).exportString()),
  authorId: z
    .custom<IUUIDTransable>()
    .transform((val) => new T_UUID(val).exportString()),
  postId: z
    .custom<IUUIDTransable>()
    .transform((val) => new T_UUID(val).exportString()),
  content: z.string(),
  prevChatId: z
    .custom<IUUIDTransable>()
    .transform((val) => new T_UUID(val).exportString())
    .optional(),
  isAnonymous: z.boolean(),

  authorFirstName: z.string(),
  authorLastName: z.string(),
  authorProfileImage: z.string(),

  createdAt: z.date().optional(),
  updatedAt: z.date().optional(),
});

export interface IChat {
  setTobeRemove(memberID: ISpaceMemberID): void;
  isTobeRemove(): boolean;

  exportResponseData(
    memberID: ISpaceMemberID,
  ): z.output<typeof chatResponseSchema>;
  exportChatData(): z.output<typeof chatPersistenceSchema>;
  setContent(content: string): void;
  changeContent(memberID: ISpaceMemberID, content: string): boolean;
  setAnonymous(): void;

  getId(): T_UUID;
  getPrevChatId(): T_UUID | false;
  getContent(memberID: ISpaceMemberID);
  setAuthor(user: IUser): boolean;
  setReply(chat: IChat): void;

  setPostId(postId: T_UUID): void;
  getPostId(): T_UUID;
  writeReply(memberID: ISpaceMemberID, chat: IChat): boolean;
  deleteChat(memberID: ISpaceMemberID): boolean;
  getSpaceId(): T_UUID;
  getAuthorId(): T_UUID;
}
