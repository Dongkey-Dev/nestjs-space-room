import { T_UUID } from 'src/util/uuid';
import { z } from 'zod';

export const createPostSchema = z.object({
  spaceId: z.string(),
  title: z.string(),
  content: z.string(),
  isAnonymous: z.boolean(),
  type: z.enum(['question', 'notice']),
});

export const updatePostSchema = z
  .object({
    title: z.string().optional(),
    content: z.string().optional(),
  })
  .refine((val) => {
    if (!val.title && !val.content) throw new Error('No update value');
    return true;
  });

export const deletePostSchema = z.object({
  postId: z.string(),
});

export const createChatSchema = z.object({
  postId: z.string(),
  content: z.string(),
  previousChatId: z.string().optional(),
  isAnonymous: z.boolean(),
});

export const updateChatSchema = z.object({
  chatId: z.string(),
  content: z.string(),
});

export const deleteChatSchema = z.object({
  chatId: z.string(),
});

export interface PostUsecase {
  getPostAll(requester: T_UUID, spaceId: T_UUID);
  getPost(requester: T_UUID, postId: T_UUID);
  createPost(requester: T_UUID, dto: z.infer<typeof createPostSchema>);
  updatePost(requester: T_UUID, dto: z.infer<typeof updatePostSchema>);
  deletePost(requester: T_UUID, postId: T_UUID);

  createChat(requester: T_UUID, dto: z.infer<typeof createChatSchema>);
  updateChat(requester: T_UUID, dto: z.infer<typeof updateChatSchema>);
  deleteChat(requester: T_UUID, chatId: T_UUID);
}
