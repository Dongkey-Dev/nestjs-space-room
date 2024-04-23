import { T_UUID } from 'src/util/uuid';
import { Inject } from '@nestjs/common';
import { DataSource } from 'typeorm';
import { IPost, IPostList } from './post.interface';
import { Post, PostList } from './post';
import { PostEntity } from 'src/database/entities/post.entity';

export interface IPostRepository {
  findPostBySpace(spaceId: T_UUID): Promise<IPostList>; //TODO: cursor pagination
  findPost(postId: T_UUID): Promise<IPost>;
  deletePost(postId: T_UUID): Promise<boolean>;
  savePost(post: IPost): Promise<boolean>;
}

export class PostRepository implements IPostRepository {
  constructor(@Inject('DATA_SOURCE') private readonly dataSource: DataSource) {}

  findPostBySpace(spaceId: T_UUID): Promise<IPostList> {
    return this.dataSource
      .getRepository(PostEntity)
      .find({
        where: { spaceId: spaceId.exportBuffer() },
      })
      .then((posts) => {
        return new PostList(posts.map((post) => this.entityToDomain(post)));
      });
  }
  findPost(postId: T_UUID): Promise<IPost> {
    return this.dataSource
      .getRepository(PostEntity)
      .findOne({ where: { id: postId.exportBuffer() } })
      .then((post) => this.entityToDomain(post));
  }
  deletePost(postId: T_UUID): Promise<boolean> {
    return this.dataSource
      .getRepository(PostEntity)
      .delete({ id: postId.exportBuffer() })
      .then(() => {
        return true;
      })
      .catch(() => {
        return false;
      });
  }
  savePost(post: IPost): Promise<boolean> {
    const postEntity = this.dataSource
      .getRepository(PostEntity)
      .create(post.exportPostData());
    return this.dataSource
      .getRepository(PostEntity)
      .save(postEntity)
      .then(() => {
        return true;
      })
      .catch(() => {
        return false;
      });
  }

  private entityToDomain(postEntity?: PostEntity): IPost {
    if (!postEntity) return new Post();
    return new Post({
      id: new T_UUID(postEntity.id),
      type: postEntity.type,
      spaceId: new T_UUID(postEntity.spaceId),
      title: postEntity.title,
      content: postEntity.content,
      authorId: postEntity.authorId,
      isAnonymous: postEntity.isAnonymous,
      createdAt: postEntity.createdAt,
      updatedAt: postEntity.updatedAt,
    });
  }
}
