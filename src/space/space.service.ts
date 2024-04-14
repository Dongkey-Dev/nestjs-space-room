import { BadRequestException, Inject, Injectable } from '@nestjs/common';
import {
  SpaceUsecase,
  createSpaceSchema,
  joinedSpaceResponseSchema,
} from './space.usecase';
import { T_UUID } from 'src/util/uuid';
import { ISpaceManager } from 'src/domain/space/space.manager.interface';
import { ISpaceMemberManager } from 'src/domain/spaceMember/spaceMember.manager.interface';
import { z } from 'zod';
import { ISpaceRoleManager } from 'src/domain/spaceRole/spaceRole.manager.interface';
import { ISpaceRole } from 'src/domain/spaceRole/spaceRole.interface';
import { ISpaceEntryCodeManager } from 'src/domain/spaceEntryCode/spaceEntryCode.manager.interface';
import { IUserManager } from 'src/domain/user/user.manager.interface';
import { ISpaceMember } from 'src/domain/spaceMember/spaceMember.interface';
import {
  ISpaceEntryCode,
  exportSpaceEntryCodeSchema,
} from 'src/domain/spaceEntryCode/spaceEntryCode.interface';
@Injectable()
export class SpaceService implements SpaceUsecase {
  constructor(
    @Inject('IUserManager')
    private readonly userManager: IUserManager,
    @Inject('ISpaceManager')
    private readonly spaceManager: ISpaceManager,
    @Inject('ISpaceMemberManager')
    private readonly spaceMemberManager: ISpaceMemberManager,
    @Inject('ISpaceRoleManager')
    private readonly spaceRoleManager: ISpaceRoleManager,
    @Inject('ISpaceEntryCodeManager')
    private readonly spaceEntryCodeManager: ISpaceEntryCodeManager,
  ) {}
  async create(ownerUuid: T_UUID, dto: z.infer<typeof createSpaceSchema>) {
    const roleList: ISpaceRole[] = [];
    const space = this.spaceManager.createSpace(dto.name, dto.logo, ownerUuid);
    dto.roleList.forEach((role) => {
      const spaceRole = this.spaceRoleManager.createRole(
        space.getId(),
        role.name,
        role.permission,
      );
      roleList.push(spaceRole);
    });

    await this.spaceManager.applySpace(space);
    const response = [];

    for (const role of dto.roleList) {
      const spaceRole = this.spaceRoleManager.createRole(
        space.getId(),
        role.name,
        role.permission,
      );
      const entryCode = await this.spaceEntryCodeManager.createEntryCode();
      await this.spaceRoleManager.applyRole(spaceRole);
      entryCode.setSpaceId(space);
      entryCode.setRoleId(spaceRole);
      await this.spaceEntryCodeManager.applyEntryCode(entryCode);
      response.push(entryCode.exportCode(spaceRole));
      if (spaceRole.getPermission() === 'admin') {
        const member = this.spaceMemberManager.createMember();
        member.setUserId(ownerUuid);
        member.setSpaceId(space.getId());
        member.setRoleId(spaceRole.getId());
        await this.spaceMemberManager.applyMember(member);
      }
    }

    return {
      roles: response,
      spaceId: space.getId().exportString(),
      spaceName: space.getName(),
      spaceLogo: space.getLogo(),
    };
  }

  async join(userUuid: T_UUID, inviteCode: string): Promise<ISpaceMember> {
    const user = await this.userManager.getDomain(userUuid);
    const entryCode =
      await this.spaceEntryCodeManager.getEntryCodeByCode(inviteCode);

    const member = await this.spaceMemberManager.getMemberByUserAndSpace(
      user,
      entryCode.getSpaceId(),
    );
    if (member.getSpaceId()) throw new BadRequestException('Already joined');
    member.setUserId(user.getId());
    member.setSpaceId(entryCode.getSpaceId());
    member.setRoleId(entryCode.getRoleId());
    await this.spaceMemberManager.applyMember(member);
    return member;
  }

  async getJoinedSpaces(
    userUuid: T_UUID,
  ): Promise<z.infer<typeof joinedSpaceResponseSchema>> {
    const user = await this.userManager.getDomain(userUuid);
    const memberList = await this.spaceMemberManager.getMembersByUser(user);
    const response = [];
    for (const member of memberList) {
      const space = await this.spaceManager.getSpace(member.getSpaceId());
      const role = await this.spaceRoleManager.getRole(member.getRoleId());
      response.push({
        spaceId: space.getId().exportString(),
        spaceName: space.getName(),
        spaceLogo: space.getLogo(),
        roleName: role.getName(),
        permission: role.getPermission(),
        isOwner: space.getOwnerId().isEqual(userUuid),
      });
    }
    return response;
  }

  async delete(useruuid: T_UUID, spaceUuid: T_UUID): Promise<boolean> {
    const space = await this.spaceManager.getSpace(spaceUuid);
    space.setTobeRemove(useruuid);
    await this.spaceManager.applySpace(space);
    return true;
  }
}
