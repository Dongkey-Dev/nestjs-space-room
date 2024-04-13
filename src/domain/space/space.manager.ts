import { T_UUID } from 'src/util/uuid';
import { DomainManager } from '../base/domainManager';
import { Space } from './space';
import { ISpace } from './space.interface';
import { ISpaceManager } from './space.manager.interface';
import { Inject, Injectable } from '@nestjs/common';
import { ISpaceRepository } from './space.repository';

@Injectable()
export class SpaceManager
  extends DomainManager<Space>
  implements ISpaceManager
{
  constructor(
    @Inject('ISpaceRepository')
    private readonly spaceRepository: ISpaceRepository,
  ) {
    super(Space);
  }

  protected sendToDatabase(toDomain: ISpace): Promise<boolean> {
    const res = this.spaceRepository.saveSpace(toDomain);
    if (!res) throw new Error('Failed to save space');
    return res;
  }
  protected async getFromDatabase(
    entityKey: any,
    condition?: any,
  ): Promise<Space> {
    return this.spaceRepository.findSpace(entityKey) as Promise<Space>;
  }
  protected getListFromDatabase(entityKey: any, condition?: any) {
    throw new Error('Method not implemented.');
  }
  createSpace(): Space {
    return new Space();
  }
  async getSpace(id: T_UUID): Promise<ISpace> {
    return await this.getFromDatabase(id);
  }
  async applySpace(space: ISpace): Promise<boolean> {
    return await this.sendToDatabase(space);
  }
}
