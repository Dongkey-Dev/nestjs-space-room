import { T_UUID } from 'src/util/uuid';
import { Inject } from '@nestjs/common';
import { DataSource } from 'typeorm';
import { IChat } from './chat.interface';
import { ChatEntity } from 'src/database/entities/chat.entity';
import { Chat } from './chat';

export interface IChatRepository {
  findChatsByPostId(postId: T_UUID): Promise<IChat[]>; //TODO: cursor pagination
  findChat(postId: T_UUID): Promise<IChat>;
  deleteChat(postId: T_UUID): Promise<boolean>;
  saveChat(chat: IChat): Promise<boolean>;
}

export class ChatRepository implements IChatRepository {
  constructor(@Inject('DATA_SOURCE') private readonly dataSource: DataSource) {}
  findChatsByPostId(postId: T_UUID): Promise<IChat[]> {
    return this.dataSource
      .getRepository(ChatEntity)
      .find({
        where: { postId: postId.exportBuffer() },
      })
      .then((chats) => {
        return chats.map((chat) => this.entityToDomain(chat));
      });
  }
  findChat(postId: T_UUID): Promise<IChat> {
    return this.dataSource
      .getRepository(ChatEntity)
      .findOne({ where: { id: postId.exportBuffer() } })
      .then((chat) => this.entityToDomain(chat));
  }
  deleteChat(postId: T_UUID): Promise<boolean> {
    return this.dataSource
      .getRepository(ChatEntity)
      .delete({ id: postId.exportBuffer() })
      .then(() => {
        return true;
      })
      .catch(() => {
        return false;
      });
  }
  saveChat(chat: IChat): Promise<boolean> {
    const chatEntity = this.dataSource
      .getRepository(ChatEntity)
      .create(chat.exportChatData());
    return this.dataSource
      .getRepository(ChatEntity)
      .save(chatEntity)
      .then(() => {
        return true;
      })
      .catch(() => {
        return false;
      });
  }

  private entityToDomain(chatEntity?: ChatEntity): IChat {
    if (!chatEntity) return new Chat();
    return new Chat({
      id: new T_UUID(chatEntity.id),
      spaceId: new T_UUID(chatEntity.spaceId),
      content: chatEntity.content,
      authorId: new T_UUID(chatEntity.authorId),
      postId: new T_UUID(chatEntity.postId),
      prevChatId: chatEntity.previousId
        ? new T_UUID(chatEntity.previousId)
        : undefined,
      isAnonymous: chatEntity.isAnonymous,
      createdAt: chatEntity.createdAt,
      updatedAt: chatEntity.updatedAt,
    });
  }
}
