import { Inject, Injectable } from '@nestjs/common';
import { ISpaceManager } from 'src/domain/space/space.manager.interface';
import { ISpaceMemberManager } from 'src/domain/spaceMember/spaceMember.manager.interface';
import { ISpaceRoleManager } from 'src/domain/spaceRole/spaceRole.manager.interface';
import { ISpaceEntryCodeManager } from 'src/domain/spaceEntryCode/spaceEntryCode.manager.interface';
import { IUserManager } from 'src/domain/user/user.manager.interface';
import { T_UUID } from 'src/util/uuid';
import { PostUsecase } from './post.usecase';
import { IPostManager } from 'src/domain/post/post.manager.interface';
import { SpaceMemberID } from 'src/domain/spaceMemberID/spaceMemberID';
import { IChatManager } from 'src/domain/chat/chat.manager.interface';
@Injectable()
export class PostSerivce implements PostUsecase {
  constructor(
    @Inject('ISpaceUserManager')
    private readonly userManager: IUserManager,
    @Inject('ISpaceManager')
    private readonly spaceManager: ISpaceManager,
    @Inject('ISpaceMemberManager')
    private readonly spaceMemberManager: ISpaceMemberManager,
    @Inject('ISpaceRoleManager')
    private readonly spaceRoleManager: ISpaceRoleManager,
    @Inject('ISpaceEntryCodeManager')
    private readonly spaceEntryCodeManager: ISpaceEntryCodeManager,
    @Inject('IPostManager')
    private readonly postManager: IPostManager,
    @Inject('IChatManager')
    private readonly chatManager: IChatManager,
  ) {}
  async getPostAll(requester: T_UUID, spaceId: T_UUID) {
    const user = await this.userManager.getDomain(requester);
    const member = await this.spaceMemberManager.getMemberByUserAndSpace(
      user,
      spaceId,
    );
    const space = await this.spaceManager.getSpace(spaceId);
    if (!member.getSpaceId().isEqual(space.getId()))
      throw new Error('Invalid Space');
    const posts = await this.postManager.getPosts(space);
    return posts.exportPosts();
  }

  async getPost(requester: T_UUID, postId: T_UUID) {
    const user = await this.userManager.getDomain(requester);
    const post = await this.postManager.getPost(postId);
    const author = await this.userManager.getDomain(post.getAuthorId());
    const member = await this.spaceMemberManager.getMemberByUserAndSpace(
      user,
      post.getSpaceId(),
    );
    post.setAuthor(author);
    const role = await this.spaceRoleManager.getRole(member.getRoleId());
    const memberId = new SpaceMemberID(member, role);
    const chats = await this.chatManager.getChats(post);
    const chatResponse = chats.map((chat) => chat.exportResponseData(memberId));
    return { post: post.exportResponseData(memberId), chatList: chatResponse };
  }

  async createPost(
    requester: T_UUID,
    dto: {
      spaceId?: string;
      title?: string;
      content?: string;
      isAnonymous?: boolean;
      type?: 'question' | 'notice';
    },
  ) {
    const spaceId = new T_UUID(dto.spaceId);
    const user = await this.userManager.getDomain(requester);
    const member = await this.spaceMemberManager.getMemberByUserAndSpace(
      user,
      spaceId,
    );
    const role = await this.spaceRoleManager.getRole(member.getRoleId());
    const memberId = new SpaceMemberID(member, role);
    if (dto.type === 'notice' && !memberId.isAdmin(spaceId))
      throw new Error('Not allowed');
    if (memberId.isAdmin(spaceId) && dto.isAnonymous)
      throw new Error('admin cannot write anonymous post');
    const post = await this.postManager.createPost(
      user,
      dto.content,
      dto.title,
      dto.isAnonymous,
    );
    return post.exportResponseData(memberId);
  }

  async updatePost(
    requester: T_UUID,
    dto: { title?: string; content?: string },
  ) {
    const user = await this.userManager.getDomain(requester);
    const post = await this.postManager.getPost(user.getId());
    post.changeTitle(requester, dto.title ? dto.title : '');
    post.changeContent(requester, dto.content ? dto.content : '');
    await this.postManager.updatePost(post);
  }

  async deletePost(requester: T_UUID, postId: T_UUID) {
    const user = await this.userManager.getDomain(requester);
    const post = await this.postManager.getPost(postId);
    const member = await this.spaceMemberManager.getMemberByUserAndSpace(
      user,
      post.getSpaceId(),
    );
    const role = await this.spaceRoleManager.getRole(member.getRoleId());
    const memberId = new SpaceMemberID(member, role);
    post.setTobeRemove(memberId);
    await this.postManager.deletePost(post);
  }
}
