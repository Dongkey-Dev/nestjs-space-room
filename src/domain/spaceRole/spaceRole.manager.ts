import { Inject } from '@nestjs/common';
import { DomainManager } from '../base/domainManager';
import { SpaceRole } from './spaceRole';
import { ISpaceRole, permissionEnum } from './spaceRole.interface';
import { ISpaceRoleManager } from './spaceRole.manager.interface';
import { ISpaceRoleRepository } from './spaceRole.repository';
import { ISpace } from '../space/space.interface';
import { T_UUID } from 'src/util/uuid';
import { z } from 'zod';

export class SpaceRoleManager
  extends DomainManager<SpaceRole>
  implements ISpaceRoleManager
{
  constructor(
    @Inject('ISpaceRoleRepository')
    private readonly spaceRoleRepository: ISpaceRoleRepository,
  ) {
    super(SpaceRole);
  }
  createRole(
    spaceId: T_UUID,
    roleName: string,
    permission: z.infer<typeof permissionEnum>,
  ): ISpaceRole {
    return this.createDomain({
      spaceId,
      roleName,
      permission,
    });
  }
  createRoles(roles: ISpaceRole[]): Promise<boolean> {
    return this.spaceRoleRepository.bulkSaveRole(roles);
  }
  getRolesBySpace(space: ISpace): Promise<ISpaceRole[]> {
    return this.spaceRoleRepository.findRolesBySpace(space);
  }

  async applyRole(role: ISpaceRole): Promise<boolean> {
    const result = this.sendToDatabase(role as SpaceRole);
    if (!result) throw new Error('Failed to save space role');
    return true;
  }
  protected async sendToDatabase(toDomain: SpaceRole): Promise<boolean> {
    let result: boolean;
    if (toDomain.isTobeRemove())
      result = await this.spaceRoleRepository.deleteRole(toDomain);
    result = await this.spaceRoleRepository.saveRole(toDomain);
    if (!result) throw new Error('Failed to apply space role');
    return true;
  }
  protected getFromDatabase(
    entityKey: any,
    condition?: any,
  ): Promise<SpaceRole> {
    return this.spaceRoleRepository.findRole(entityKey) as Promise<SpaceRole>;
  }
}
