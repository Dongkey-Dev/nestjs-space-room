import { DomainManager } from '../base/domainManager';
import { IUser } from '../user/user.interface';
import { SpaceRole } from './spaceRole';
import { ISpaceRole } from './spaceRole.interface';
import { ISpaceRoleManager } from './spaceRole.manager.interface';

export class SpaceRoleManager
  extends DomainManager<SpaceRole>
  implements ISpaceRoleManager
{
  createRole(roleName: string, permission: 'admin' | 'user'): ISpaceRole {
    throw new Error('Method not implemented.');
  }
  applyRole(role: ISpaceRole): boolean {
    throw new Error('Method not implemented.');
  }
  getRole(user: IUser): ISpaceRole {
    throw new Error('Method not implemented.');
  }
  protected sendToDatabase(toDomain: SpaceRole): Promise<boolean> {
    throw new Error('Method not implemented.');
  }
  protected getFromDatabase(
    entityKey: any,
    condition?: any,
  ): Promise<SpaceRole> {
    throw new Error('Method not implemented.');
  }
  protected getListFromDatabase(entityKey: any, condition?: any) {
    throw new Error('Method not implemented.');
  }
}
