import { DomainManager } from '../base/domainManager';
import { Inject, Injectable } from '@nestjs/common';
import { IChatManager } from './chat.manager.interface';
import { Chat } from './chat';
import { IChatRepository } from './chat.repository';
import { T_UUID } from 'src/util/uuid';
import { IPost } from '../post/post.interface';
import { IUser } from '../user/user.interface';
import { IChat } from './chat.interface';

@Injectable()
export class ChatManager extends DomainManager<Chat> implements IChatManager {
  constructor(
    @Inject('IChatRepository')
    private readonly chatRepository: IChatRepository,
  ) {
    super(Chat);
  }

  protected async sendToDatabase(toDomain: Chat): Promise<boolean> {
    return await this.chatRepository.saveChat(toDomain);
  }
  protected async getFromDatabase(
    entityKey: any,
    condition?: any,
  ): Promise<Chat> {
    return (await this.chatRepository.findChat(entityKey)) as Chat;
  }
  createChat(writer: IUser, content: string, isAnonymous?: boolean): IChat {
    const chat = new Chat();
    chat.setAuthor(writer);
    chat.setContent(content);
    if (isAnonymous) chat.setAnonymous();
    return chat;
  }
  async getChat(id: T_UUID): Promise<IChat> {
    return await this.chatRepository.findChat(id);
  }
  async getChats(post: IPost): Promise<IChat[]> {
    return await this.chatRepository.findChatsByPostId(post.getId());
  }
  async applyChat(chat: IChat): Promise<boolean> {
    return await this.sendToDatabase(chat as Chat);
  }
}
