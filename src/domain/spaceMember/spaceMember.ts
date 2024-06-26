import { T_UUID } from 'src/util/uuid';
import { BaseDomain } from '../base/baseDomain';
import {
  ISpaceMember,
  spaceMemberPersistenceSchema,
  spaceMemberSchema,
} from './spaceMember.interface';
import { z } from 'zod';
import { ISpaceRole } from '../spaceRole/spaceRole.interface';
import { ISpace } from '../space/space.interface';
import { BadRequestException } from '@nestjs/common';

export class SpaceMember
  extends BaseDomain<typeof spaceMemberSchema>
  implements ISpaceMember
{
  private id: T_UUID;
  private spaceId: T_UUID;
  private userId: T_UUID;
  private roleId: T_UUID;
  constructor(data?: z.input<typeof spaceMemberSchema>) {
    super(spaceMemberSchema);
    if (data) this.import(data);
    if (!this.id) this.id = new T_UUID();
  }
  getId(): T_UUID {
    return this.id;
  }
  exportSpaceMemberData(): z.infer<typeof spaceMemberPersistenceSchema> {
    return spaceMemberPersistenceSchema.parse(this.exportPersistence());
  }
  getUserId(): T_UUID {
    if (!this.userId) throw new BadRequestException('User id is not set');
    return this.userId;
  }
  setUserId(userId: T_UUID): boolean {
    this.userId = userId;
    return true;
  }
  getRoleId(): T_UUID {
    if (!this.roleId) throw new BadRequestException('Role id is not set');
    return this.roleId;
  }
  setRoleId(roleId: T_UUID): boolean {
    if (!this.roleId) this.roleId = roleId;
    else throw new BadRequestException('Role id is already set');
    return true;
  }
  getSpaceId(): T_UUID {
    if (!this.spaceId) throw new BadRequestException('Space id is not set');
    return this.spaceId;
  }
  setSpaceId(spaceId: T_UUID): boolean {
    if (!this.spaceId) this.spaceId = spaceId;
    else throw new BadRequestException('Space id is already set');
    return true;
  }

  changeRole(space: ISpace, requesterId: T_UUID, newRole: ISpaceRole): boolean {
    if (requesterId.isEqual(space.getOwnerId())) {
      this.roleId = newRole.getId();
      return true;
    }
    throw new BadRequestException('Only owner can change role');
  }
}
