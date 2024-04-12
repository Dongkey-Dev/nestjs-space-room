import { T_UUID } from 'src/util/uuid';
import { ISpace } from './space.interface';
import { DomainManager } from '../base/domainManager';
import { Space } from './space';
import { ISpaceManager } from './space.manager.interface';
import { SpaceMember } from './spaceMember';
import { ISpaceMemberManager } from './spaceMember.manager.interface';
import { ISpace } from '../space/space.interface';
import { IUser } from '../user/user.interface';
import { ISpaceMember } from './spaceMember.interface';

export class SpaceMemberManager
  extends DomainManager<SpaceMember>
  implements ISpaceMemberManager
{
  protected sendToDatabase(toDomain: SpaceMember): Promise<boolean> {
    throw new Error('Method not implemented.');
  }
  protected getFromDatabase(
    entityKey: any,
    condition?: any,
  ): Promise<SpaceMember> {
    throw new Error('Method not implemented.');
  }
  protected getListFromDatabase(entityKey: any, condition?: any) {
    throw new Error('Method not implemented.');
  }
  applyMember(member: ISpaceMember): boolean {
    throw new Error('Method not implemented.');
  }
  createMember(space: ISpace): ISpaceMember {
    throw new Error('Method not implemented.');
  }
}
