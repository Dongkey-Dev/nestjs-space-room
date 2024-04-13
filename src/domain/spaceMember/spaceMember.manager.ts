import { DomainManager } from '../base/domainManager';
import { SpaceMember } from './spaceMember';
import { ISpaceMemberManager } from './spaceMember.manager.interface';
import { ISpaceMember } from './spaceMember.interface';
import { ISpace } from '../space/space.interface';
import { IUser } from '../user/user.interface';

export class SpaceMemberManager
  extends DomainManager<SpaceMember>
  implements ISpaceMemberManager
{
  getMembersBySpace(space: ISpace): ISpaceMember[] {
    throw new Error('Method not implemented.');
  }
  getMembersByUser(user: IUser): ISpaceMember[] {
    throw new Error('Method not implemented.');
  }
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
