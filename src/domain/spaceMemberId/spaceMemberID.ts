import { T_UUID } from 'src/util/uuid';
import { BaseDomain } from '../base/baseDomain';
import { ISpaceMemberID, spaceMemberIDSchema } from './spaceMemberID.interface';
import { z } from 'zod';
import { ISpaceRole, permissionEnum } from '../spaceRole/spaceRole.interface';
import { ISpaceMember } from '../spaceMember/spaceMember.interface';
import { BadRequestException } from '@nestjs/common';

export class SpaceMemberID
  extends BaseDomain<typeof spaceMemberIDSchema>
  implements BaseDomain<typeof spaceMemberIDSchema>, ISpaceMemberID
{
  private spaceId: T_UUID;
  private userId: T_UUID;
  private permission: z.infer<typeof permissionEnum>;
  constructor(member: ISpaceMember, role: ISpaceRole) {
    super(spaceMemberIDSchema);
    const con1 = member.getSpaceId().isEqual(role.getSpaceId());
    const con2 = member.getRoleId().isEqual(role.getId());
    if (con1 && con2) {
      this.import({
        spaceId: member.getSpaceId(),
        userId: member.getUserId(),
        permission: role.getPermission(),
      });
    } else {
      throw new BadRequestException('SpaceMemberId generation failed');
    }
  }
  getUserId(): T_UUID {
    return this.userId;
  }
  isAdmin(spaceId: T_UUID): boolean {
    if (this.spaceId.isEqual(spaceId) && this.permission === 'admin')
      return true;
    return false;
  }
  isMember(spaceId: T_UUID): boolean {
    if (this.spaceId.isEqual(spaceId)) return true;
    return false;
  }
}
