import { T_UUID } from 'src/util/uuid';
import { ISpace } from '../space/space.interface';
import { IUser } from '../user/user.interface';
import { IPost, IPostList } from './post.interface';

export interface IPostManager {
  createPost(
    writer: IUser,
    content: string,
    title: string,
    spaceId: T_UUID,
    isAnonymous?: boolean,
  ): Promise<IPost>;
  getPosts(space: ISpace): Promise<IPostList>;
  getPost(id: T_UUID): Promise<IPost>;
  deletePost(post: IPost): Promise<boolean>;
  updatePost(post: IPost): Promise<boolean>;
}
