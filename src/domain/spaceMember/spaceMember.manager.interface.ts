import { ISpace } from '../space/space.interface';
import { IUser } from '../user/user.interface';
import { ISpaceMember } from './spaceMember.interface';

export interface ISpaceMemberManager {
  createMember(): ISpaceMember;
  getMembersBySpace(space: ISpace): Promise<ISpaceMember[]>;
  getMembersByUser(user: IUser): Promise<ISpaceMember[]>;
  applyMember(member: ISpaceMember): Promise<boolean>;
}
