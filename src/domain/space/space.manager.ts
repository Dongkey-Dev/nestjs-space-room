import { T_UUID } from 'src/util/uuid';
import { ISpace } from './space.interface';
import { DomainManager } from '../base/domainManager';
import { Space } from './space';
import { ISpaceManager } from './space.manager.interface';

export class SpaceManager
  extends DomainManager<Space>
  implements ISpaceManager
{
  protected sendToDatabase(toDomain: Space): Promise<boolean> {
    throw new Error('Method not implemented.');
  }
  protected getFromDatabase(entityKey: any, condition?: any): Promise<Space> {
    throw new Error('Method not implemented.');
  }
  protected getListFromDatabase(entityKey: any, condition?: any) {
    throw new Error('Method not implemented.');
  }
  createSpace(space: ISpace): boolean {
    throw new Error('Method not implemented.');
  }
  getSpace(id: T_UUID): ISpace {
    throw new Error('Method not implemented.');
  }
  applySpace(space: ISpace): boolean {
    throw new Error('Method not implemented.');
  }
}
