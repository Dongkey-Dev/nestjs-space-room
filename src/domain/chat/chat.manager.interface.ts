import { T_UUID } from 'src/util/uuid';
import { IUser } from '../user/user.interface';
import { IChat } from './chat.interface';
import { IPost } from '../post/post.interface';

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
