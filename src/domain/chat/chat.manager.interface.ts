import { T_UUID } from 'src/util/uuid';
import { IUser } from '../user/user.interface';
import { IChat } from './chat.interface';
import { IPost } from '../post/post.interface';

export interface IChatManager {
  createChat(
    writer: IUser,
    postId: T_UUID,
    content: string,
    isAnonymous?: boolean,
  ): IChat;
  getChat(id: T_UUID): Promise<IChat>;
  getChats(post: IPost): Promise<IChat[]>;
  applyChat(chat: IChat): Promise<boolean>;
}
