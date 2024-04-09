import { T_UUID } from 'src/util/uuid';
import { BaseDomain } from '../base/baseDomain';
import { ISpaceMember, spaceMemberSchema } from './spaceMember.interface';
import { z } from 'zod';
import { ISpaceRole } from '../spaceRole/spaceRole.interface';

export class SpaceMember
  extends BaseDomain<typeof spaceMemberSchema>
  implements BaseDomain<typeof spaceMemberSchema>, ISpaceMember
{
  id: T_UUID;
  spaceId: T_UUID;
  userId: T_UUID;
  roleId: T_UUID;
  constructor(data?: z.infer<typeof spaceMemberSchema>) {
    super(spaceMemberSchema);
    if (data) this.import(data);
    if (!this.id) this.id = new T_UUID();
  }
  getUserId(): T_UUID {
    if (!this.userId) throw new Error('User id is not set');
    return this.userId;
  }
  setUserId(userId: T_UUID): boolean {
    this.userId = userId;
    return true;
  }
  getRoleId(): T_UUID {
    if (!this.roleId) throw new Error('Role id is not set');
    return this.roleId;
  }
  setRoleId(roleId: T_UUID): boolean {
    if (!this.roleId) this.roleId = roleId;
    else throw new Error('Role id is already set');
    return true;
  }
  getSpaceId(): T_UUID {
    if (!this.spaceId) throw new Error('Space id is not set');
    return this.spaceId;
  }
  setSpaceId(spaceId: T_UUID): boolean {
    if (!this.spaceId) this.spaceId = spaceId;
    else throw new Error('Space id is already set');
    return true;
  }

  changeRole(
    requesterId: T_UUID,
    ownerMember: ISpaceMember,
    newRole: ISpaceRole,
  ): boolean {
    if (requesterId === ownerMember.getUserId()) {
      this.roleId = newRole.getId();
      return true;
    }
    throw new Error('Only owner can change role');
  }
}