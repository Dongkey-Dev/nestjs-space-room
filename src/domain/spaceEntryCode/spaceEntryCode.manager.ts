import { DomainManager } from '../base/domainManager';
import { ISpace } from '../space/space.interface';
import { SpaceEntryCode } from './spaceEntryCode';
import { ISpaceEntryCode } from './spaceEntryCode.interface';
import { ISpaceEntryCodeManager } from './spaceEntryCode.manager.interface';
import { ISpaceEntryCodeRepository } from './spaceEntryCode.repository';
import { Inject } from '@nestjs/common';

export class SpaceEntryCodeManager
  extends DomainManager<SpaceEntryCode>
  implements ISpaceEntryCodeManager
{
  constructor(
    @Inject('ISpaceEntryCodeRepository')
    private readonly spaceEntryCodeRepository: ISpaceEntryCodeRepository,
  ) {
    super(SpaceEntryCode);
  }
  async getEntryCodeByCode(code: string): Promise<ISpaceEntryCode> {
    const entryCode = await this.getFromDatabase(code);
    if (!entryCode.getSpaceId()) throw new Error('wrong space code');
    return entryCode;
  }

  protected sendToDatabase(toDomain: SpaceEntryCode): Promise<boolean> {
    if (toDomain.isTobeRemove())
      return this.spaceEntryCodeRepository.delete(toDomain);
    return this.spaceEntryCodeRepository.save(toDomain);
  }

  protected getFromDatabase(
    entityKey: any,
    condition?: any,
  ): Promise<SpaceEntryCode> {
    return this.spaceEntryCodeRepository.findByCode(
      entityKey as string,
    ) as Promise<SpaceEntryCode>;
  }

  async createEntryCode(): Promise<ISpaceEntryCode> {
    return await this.spaceEntryCodeRepository.findEmptyCode();
  }

  async createEntryCodes(num: number): Promise<ISpaceEntryCode[]> {
    return await this.spaceEntryCodeRepository.findEmptyCodes(num);
  }

  async getEntryCodesBySpace(space: ISpace): Promise<ISpaceEntryCode[]> {
    const codeList = await this.spaceEntryCodeRepository.findBySpaceId(
      space.getId(),
    );
    if (codeList.length === 0) {
      throw new Error('No entry code found.');
    }
    return codeList;
  }
}
