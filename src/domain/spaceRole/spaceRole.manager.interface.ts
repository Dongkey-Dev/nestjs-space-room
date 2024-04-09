import { IUser } from '../user/user.interface';
import { ISpaceRole } from './spaceRole.interface';

export interface ISpaceRoleManager {
  createRole(roleName: string, permission: 'admin' | 'user'): ISpaceRole;
  applyRole(role: ISpaceRole): boolean;
  getRole(user: IUser): ISpaceRole;
}
