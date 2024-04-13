import { ISpace } from '../space/space.interface';
import { IUser } from '../user/user.interface';
import { ISpaceMember } from './spaceMember.interface';

export interface ISpaceMemberManager {
  createMember(space: ISpace): ISpaceMember;
  getMembersBySpace(space: ISpace): ISpaceMember[];
  getMembersByUser(user: IUser): ISpaceMember[];
  applyMember(member: ISpaceMember): boolean;
}
