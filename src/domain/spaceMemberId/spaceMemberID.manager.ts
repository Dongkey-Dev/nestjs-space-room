import { DomainManager } from '../base/domainManager';
import { SpaceMember } from './spaceMember';
import { ISpaceMemberIDManager } from './spaceMemberID.manager.interface';

export class SpaceMemberIDManager
  extends DomainManager<SpaceMember>
  implements ISpaceMemberIDManager
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
  createMember(space: ISpace) {
    throw new Error('Method not implemented.');
  }
}
