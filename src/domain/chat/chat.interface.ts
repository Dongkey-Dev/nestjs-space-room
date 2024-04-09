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
});

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
