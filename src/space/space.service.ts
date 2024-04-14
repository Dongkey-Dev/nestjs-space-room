import { Inject, Injectable } from '@nestjs/common';
import { SpaceUsecase, createSpaceSchema } from './space.usecase';
import { ISpace } from 'src/domain/space/space.interface';
import { ISpaceMemberID } from 'src/domain/spaceMemberID/spaceMemberID.interface';
import { T_UUID } from 'src/util/uuid';
import { ISpaceManager } from 'src/domain/space/space.manager.interface';
import { ISpaceMemberManager } from 'src/domain/spaceMember/spaceMember.manager.interface';
import { z } from 'zod';
import { ISpaceRoleManager } from 'src/domain/spaceRole/spaceRole.manager.interface';
import { ISpaceRole } from 'src/domain/spaceRole/spaceRole.interface';
@Injectable()
export class SpaceSerivce implements SpaceUsecase {
  constructor(
    @Inject('ISpaceManager')
    private readonly spaceManager: ISpaceManager,
    @Inject('ISpaceMemberManager')
    private readonly spaceMemberManager: ISpaceMemberManager,
    @Inject('ISpaceRoleManager')
    private readonly spaceRoleManager: ISpaceRoleManager,
  ) {}
  async create(
    ownerUuid: T_UUID,
    dto: z.infer<typeof createSpaceSchema>,
  ): Promise<ISpace> {
    const roleList: ISpaceRole[] = [];
    const space = this.spaceManager.createSpace(dto.name, dto.logo, ownerUuid);
    space.setLogo(dto.logo);
    space.setName(dto.name);
    dto.roleList.forEach((role) => {
      const spaceRole = this.spaceRoleManager.createRole(
        space.getId(),
        role.name,
        role.permission,
      );
      roleList.push(spaceRole);
    });
    await this.spaceManager.applySpace(space);
    await this.spaceRoleManager.createRoles(roleList);
    return space;
  }
  join(
    userUuid: T_UUID,
    inviteCode: string,
    roleName: string,
  ): Promise<ISpaceMemberID> {
    throw new Error('Method not implemented.');
  }
  find(userUuid: T_UUID, spaceUuid: T_UUID): Promise<ISpace[]> {
    throw new Error('Method not implemented.');
  }
  delete(useruuid: T_UUID, spaceUuid: T_UUID): Promise<void> {
    throw new Error('Method not implemented.');
  }
}
