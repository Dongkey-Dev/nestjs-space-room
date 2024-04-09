import { ISpace } from '../space/space.interface';
import { IUser } from '../user/user.interface';
import { IPost } from './post.interface';

export interface IPostManager {
  createPost(writer: IUser, content: string, isAnonymous?: boolean): IPost;
  getPosts(space: ISpace): IPost[];
  deletePost(post: IPost): boolean;
}
