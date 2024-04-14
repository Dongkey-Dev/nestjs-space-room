import { T_UUID } from 'src/util/uuid';
import { BaseDomain } from '../base/baseDomain';
import { IChat, chatPersistenceSchema, chatSchema } from './chat.interface';
import { IUser } from '../user/user.interface';
import { z } from 'zod';
import { ISpaceMemberID } from '../spaceMemberID/spaceMemberID.interface';
import { BadRequestException } from '@nestjs/common';

export class Chat extends BaseDomain<typeof chatSchema> implements IChat {
  private id: T_UUID;
  private spaceId: T_UUID;
  private authorId: T_UUID;
  private content: string;
  private postId: T_UUID;
  private prevChatId?: T_UUID;
  private isAnonymous: boolean;
  private author: IUser;

  private createdAt?: Date;
  private updatedAt?: Date;
  constructor(data?: z.infer<typeof chatSchema>) {
    super(chatSchema);
    if (data) this.import(data);
    if (!this.id) this.id = new T_UUID();
  }
  exportResponseData(memberID: ISpaceMemberID): {
    id?: string;
    spaceId?: string;
    authorId?: string;
    postId?: string;
    content?: string;
    prevChatId?: string;
    isAnonymous?: boolean;
    authorFirstName?: string;
    authorLastName?: string;
    authorProfileImage?: string;
    createdAt?: Date;
    updatedAt?: Date;
  } {
    if (
      this.isAnonymous &&
      !(
        memberID.isAdmin(this.spaceId) ||
        this.authorId.isEqual(memberID.getUserId())
      )
    ) {
      return {
        id: this.id.toString(),
        spaceId: this.spaceId.toString(),
        authorId: this.authorId.toString(),
        postId: this.postId.toString(),
        content: this.content,
        prevChatId: this.prevChatId?.toString(),
        isAnonymous: true,
        authorFirstName: 'Anonymous',
        authorLastName: 'Anonymous',
        authorProfileImage: 'Anonymous.png',
        createdAt: this.createdAt,
        updatedAt: this.updatedAt,
      };
    }
    return {
      id: this.id.toString(),
      spaceId: this.spaceId.toString(),
      authorId: this.authorId.toString(),
      postId: this.postId.toString(),
      content: this.content,
      prevChatId: this.prevChatId?.toString(),
      isAnonymous: this.isAnonymous,
      authorFirstName: this.author.getProfile().firstName,
      authorLastName: this.author.getProfile().lastName,
      authorProfileImage: this.author.getProfile().profileImage,
      createdAt: this.createdAt,
      updatedAt: this.updatedAt,
    };
  }

  setTobeRemove(memberID: ISpaceMemberID): void {
    if (
      !memberID.isAdmin(this.spaceId) &&
      !memberID.getUserId().isEqual(this.authorId)
    )
      throw new BadRequestException('Not allowed');
    this.changes.setToBeRemoved({ id: this.id });
  }
  isTobeRemove(): boolean {
    if (this.changes.exportToBeRemoved()) return true;
    return false;
  }
  setContent(content: string): void {
    if (!this.content) this.content = content;
    throw new BadRequestException('Content already exists');
  }
  exportChatData(): z.output<typeof chatPersistenceSchema> {
    return chatPersistenceSchema.parse(this.exportPersistence());
  }
  setAuthor(user: IUser): boolean {
    if (!this.authorId.isEqual(user.getId()))
      throw new BadRequestException('chat author not matched with user');
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
      throw new BadRequestException('Not allowed');
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
    if (cond1 || cond2) throw new BadRequestException('Not allowed');
    chat.setReply(this);
    return true;
  }

  getAuthorId(): T_UUID {
    return this.authorId;
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
      throw new BadRequestException('Not allowed');
    this.content = content;
    return true;
  }

  setAnonymous(): void {
    this.isAnonymous = true;
  }

  setPostId(postId: T_UUID): void {
    this.postId = postId;
  }

  getSpaceId(): T_UUID {
    return this.spaceId;
  }
}
