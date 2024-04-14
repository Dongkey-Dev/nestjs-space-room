import { Inject, Injectable } from '@nestjs/common';
import { ISpaceManager } from 'src/domain/space/space.manager.interface';
import { ISpaceMemberManager } from 'src/domain/spaceMember/spaceMember.manager.interface';
import { ISpaceRoleManager } from 'src/domain/spaceRole/spaceRole.manager.interface';
import { ISpaceEntryCodeManager } from 'src/domain/spaceEntryCode/spaceEntryCode.manager.interface';
import { IUserManager } from 'src/domain/user/user.manager.interface';
import { RoleUsecase } from './role.usecase';
import { T_UUID } from 'src/util/uuid';
import { SpaceMemberID } from 'src/domain/spaceMemberID/spaceMemberID';
@Injectable()
export class RoleSerivce implements RoleUsecase {
  constructor(
    @Inject('ISpaceUserManager')
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

  async updateUserRole(
    requesterUuid: T_UUID,
    targetUserUuid: T_UUID,
    spaceId: T_UUID,
    roleId: T_UUID,
  ): Promise<boolean> {
    const space = await this.spaceManager.getSpace(spaceId);
    const newRole = await this.spaceRoleManager.getRole(roleId);
    const targetUser = await this.userManager.getDomain(targetUserUuid);
    const targetMember = await this.spaceMemberManager.getMemberByUserAndSpace(
      targetUser,
      spaceId,
    );
    targetMember.changeRole(space, requesterUuid, newRole);
    await this.spaceMemberManager.applyMember(targetMember);
    return true;
  }

  async addRole(
    requesterUuid: T_UUID,
    spaceUuid: T_UUID,
    roleList: { name?: string; permission?: 'admin' | 'member' }[],
  ): Promise<boolean> {
    const space = await this.spaceManager.getSpace(spaceUuid);
    roleList.forEach(async (role) => {
      const spaceRole = this.spaceRoleManager.createRole(
        spaceUuid,
        role.name,
        role.permission,
      );
      await this.spaceRoleManager.applyRole(spaceRole);

      const entryCode = await this.spaceEntryCodeManager.createEntryCode();
      entryCode.setSpaceId(space);
      entryCode.setRoleId(spaceRole);
      await this.spaceEntryCodeManager.applyEntryCode(entryCode);
    });
    return true;
  }

  async removeRole(
    requeterUuid: T_UUID,
    spaceUuid: T_UUID,
    roleId: T_UUID,
  ): Promise<boolean> {
    const space = await this.spaceManager.getSpace(spaceUuid);
    const role = await this.spaceRoleManager.getRole(roleId);
    const memberList = await this.spaceMemberManager.getMembersBySpace(space);
    memberList.forEach(async (member) => {
      role.checkRemovableNoUse(member);
    });
    space.removeRole(requeterUuid, role);
    await this.spaceRoleManager.applyRole(role);
    return true;
  }
}
