import { DomainManager } from '../base/domainManager';
import { Inject, Injectable } from '@nestjs/common';
import { IPostManager } from './post.manager.interface';
import { Post } from './post';
import { IPostRepository } from './post.repository';
import { ISpace } from '../space/space.interface';
import { IUser } from '../user/user.interface';
import { IPost, IPostList } from './post.interface';
import { T_UUID } from 'src/util/uuid';

@Injectable()
export class PostManager extends DomainManager<Post> implements IPostManager {
  constructor(
    @Inject('IPostRepository')
    private readonly postRepository: IPostRepository,
  ) {
    super(Post);
  }

  protected async sendToDatabase(toDomain: Post): Promise<boolean> {
    if (toDomain.isTobeRemove())
      return await this.postRepository.deletePost(toDomain.getId());
    return await this.postRepository.savePost(toDomain);
  }

  protected async getFromDatabase(
    entityKey: any,
    condition?: any,
  ): Promise<Post> {
    return (await this.postRepository.findPost(entityKey)) as Post;
  }

  async createPost(
    writer: IUser,
    content: string,
    title: string,
    isAnonymous?: boolean,
  ): Promise<IPost> {
    const post = this.createDomain();
    post.setAuthor(writer);
    post.setContent(content);
    post.setTitle(title);
    if (isAnonymous) {
      post.setAnonymous();
    }
    await this.sendToDatabase(post);
    return post;
  }

  async getPosts(space: ISpace): Promise<IPostList> {
    const postList = await this.postRepository.findPostBySpace(space.getId());
    return postList;
  }

  async getPost(id: T_UUID): Promise<IPost> {
    return await this.getFromDatabase(id);
  }

  async deletePost(post: IPost): Promise<boolean> {
    return await this.sendToDatabase(post as Post);
  }

  async updatePost(post: IPost): Promise<boolean> {
    return await this.sendToDatabase(post as Post);
  }
}
