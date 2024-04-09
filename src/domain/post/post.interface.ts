import { z } from 'zod';
import { IUser, profileSchema, userSchema } from '../user/user.interface';
import { IUUIDTransable, T_UUID } from 'src/util/uuid';
import { ISpaceMemberID } from '../spaceMemberID/spaceMemberID.interface';

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
