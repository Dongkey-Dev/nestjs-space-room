import { ISpace } from '../space/space.interface';
import { IUser } from '../user/user.interface';
import { ISpaceMember } from './spaceMember.interface';

export interface ISpaceMemberManager {
  createMember(space: ISpace): ISpaceMember;
  getMembers(space: ISpace): ISpaceMember[];
  getMembers(user: IUser): ISpaceMember[];
  applyMember(member: ISpaceMember): boolean;
}
