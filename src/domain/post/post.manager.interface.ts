import { ISpace } from '../space/space.interface';
import { IUser } from '../user/user.interface';
import { IPost } from './post.interface';

export interface IPostManager {
  createPost(
    writer: IUser,
    content: string,
    title: string,
    isAnonymous?: boolean,
  ): IPost;
  getPosts(space: ISpace): Promise<IPost[]>;
  deletePost(post: IPost): Promise<boolean>;
}
