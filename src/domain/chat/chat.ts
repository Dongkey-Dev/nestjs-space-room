import { T_UUID } from 'src/util/uuid';
import { BaseDomain } from '../base/baseDomain';
import { IChat, chatSchema } from './chat.interface';
import { IUser } from '../user/user.interface';
import { z } from 'zod';
import { ISpaceMemberID } from '../spaceMemberID/spaceMemberID.interface';

export class Chat extends BaseDomain<typeof chatSchema> implements IChat {
  private id: T_UUID;
  private spaceId: T_UUID;
  private authorId: T_UUID;
  private content: string;
  private postId: T_UUID;
  private prevChatId?: T_UUID;
  private isAnonymous: boolean;
  private author: IUser;
  constructor(data: z.infer<typeof chatSchema>) {
    super(chatSchema);
    this.import(data);
    if (!this.id) this.id = new T_UUID();
  }
  setAuthor(user: IUser): boolean {
    if (!this.authorId.isEqual(user.getId()))
      throw new Error('chat author not matched with user');
    this.author = user;
    return true;
  }
  deleteChat(memberID: ISpaceMemberID): boolean {
    if (
      !(
        memberID.isAdmin(this.spaceId) ||
        memberID.getUserId().isEqual(this.authorId)
      )
    )
      throw new Error('Not allowed');
    return true;
  }
  setReply(chat: IChat): void {
    this.prevChatId = chat.getId();
  }

  getId(): T_UUID {
    return this.id;
  }

  getPrevChatId(): T_UUID | false {
    if (!this.prevChatId) return false;
    return this.prevChatId;
  }

  getPostId(): T_UUID {
    return this.postId;
  }

  writeReply(memberID: ISpaceMemberID, chat: IChat): boolean {
    const cond1 = !memberID.isMember(this.spaceId);
    const cond2 = !this.getPostId().isEqual(chat.getPostId());
    if (cond1 || cond2) throw new Error('Not allowed');
    chat.setReply(this);
    return true;
  }

  getContent(memberID: ISpaceMemberID) {
    const content = this.exportJson();
    delete content.author.email;
    if (memberID.isAdmin(this.spaceId)) return content;
    if (this.isAnonymous && !memberID.getUserId().isEqual(this.authorId)) {
      const output = this.exportJson();
      const anonymousProfile = this.author.getAnonymousProfile();
      output.author = anonymousProfile;
      return output;
    }
    return content;
  }

  changeContent(memberID: ISpaceMemberID, content: string): boolean {
    if (
      !(
        memberID.isMember(this.spaceId) &&
        memberID.getUserId().isEqual(this.authorId)
      )
    )
      throw new Error('Not allowed');
    this.content = content;
    return true;
  }
}
