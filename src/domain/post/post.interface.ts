import { z } from 'zod';
import { IUser, profileSchema, userSchema } from '../user/user.interface';
import { IUUIDTransable, T_UUID } from 'src/util/uuid';
import { ISpaceMemberID } from '../spaceMemberID/spaceMemberID.interface';

export const anonymousProfile: z.infer<typeof profileSchema> = {
  lastName: 'anonymous',
  firstName: 'anonymous',
  profileImage: 'anonymous.png',
};
export const postSchema = z.object({
  id: z.custom<IUUIDTransable>().transform((val) => new T_UUID(val)),
  type: z.string(),
  spaceId: z.custom<IUUIDTransable>().transform((val) => new T_UUID(val)),
  isAnonymous: z.boolean(),
  title: z.string(),
  content: z.string(),
  authorId: z.custom<IUUIDTransable>().transform((val) => new T_UUID(val)),
  author: userSchema.optional(),
  totalComments: z.number().default(0),
  totalParticipants: z.number().default(0),
  ranking: z.number().default(0),
  createdAt: z.date().optional(),
  updatedAt: z.date().optional(),
});

export const postResponseSchema = z.object({
  id: z
    .custom<IUUIDTransable>()
    .transform((val) => new T_UUID(val).exportString()),
  type: z.string(),
  spaceId: z
    .custom<IUUIDTransable>()
    .transform((val) => new T_UUID(val).exportString()),
  isAnonymous: z.boolean(),
  title: z.string(),
  content: z.string(),
  authorLastName: z.string(),
  authorFirstName: z.string(),
  authorProfileImage: z.string(),
  createdAt: z.date().optional(),
  updatedAt: z.date().optional(),
});

export const postPersistenceSchema = z.object({
  id: z
    .custom<IUUIDTransable>()
    .transform((val) => new T_UUID(val).exportBuffer()),
  type: z.string(),
  spaceId: z
    .custom<IUUIDTransable>()
    .transform((val) => new T_UUID(val).exportBuffer()),
  isAnonymous: z.boolean(),
  title: z.string(),
  content: z.string(),
  authorId: z
    .custom<IUUIDTransable>()
    .transform((val) => new T_UUID(val).exportBuffer()),
  totalComments: z.number().default(0),
  totalParticipants: z.number().default(0),
});

export interface IPost {
  exportResponseData(
    memberId: ISpaceMemberID,
  ): z.infer<typeof postResponseSchema>;
  exportPostData(): z.infer<typeof postPersistenceSchema>;
  setTobeRemove(memberId: ISpaceMemberID): void;
  isTobeRemove(): boolean;
  isAuthor(userId: T_UUID): boolean;

  getId(): T_UUID;
  getType(): string;
  getSpaceId(): T_UUID;
  changeType(type: string, spaceMember: ISpaceMemberID): boolean;

  changeTitle(requester: T_UUID, title: string): boolean;
  changeContent(requester: T_UUID, content: string): boolean;

  getTitle(): string;
  setTitle(title: string): void;

  getContent(): string;
  setContent(content: string): void;

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

  setAnonymous(): void;
  setSpaceId(spaceId: T_UUID): void;
}

export const exportPostsSchema = z
  .object({
    id: z
      .custom<IUUIDTransable>()
      .transform((val) => new T_UUID(val).exportBuffer()),
    type: z.string(),
    spaceId: z
      .custom<IUUIDTransable>()
      .transform((val) => new T_UUID(val).exportBuffer()),
    title: z.string(),
    totalComments: z.number().default(0),
    ranking: z.number().default(0),
  })
  .array();

export interface IPostList {
  getPosts(): IPost[];
  exportPosts(): z.output<typeof exportPostsSchema>;
}
