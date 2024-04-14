import { T_UUID } from 'src/util/uuid';
import { BaseDomain } from '../base/baseDomain';
import {
  ISpaceRole,
  permissionEnum,
  spaceRolePersistenceSchema,
  spaceRoleSchema,
} from './spaceRole.interface';
import { z } from 'zod';
import { ISpaceMember } from '../spaceMember/spaceMember.interface';
import { DomainChange } from '../base/domainChange';
import { BadRequestException } from '@nestjs/common';

export class SpaceRole
  extends BaseDomain<typeof spaceRoleSchema>
  implements ISpaceRole
{
  private id: T_UUID;
  private spaceId: T_UUID;
  private roleName: string;
  private permission: z.infer<typeof permissionEnum>;
  constructor(data?: z.infer<typeof spaceRoleSchema>) {
    super(spaceRoleSchema);
    if (data) this.import(data);
    if (!this.id) this.id = new T_UUID();
    this.changes = new DomainChange();
  }
  checkRemovableNoUse(member: ISpaceMember): boolean {
    if (member.getRoleId().isEqual(this.id))
      throw new BadRequestException('Role is in use');
    return true;
  }
  getName(): string {
    if (!this.roleName) throw new BadRequestException('Role name is not set');
    return this.roleName;
  }
  isTobeRemove(): boolean {
    return this.changes.exportToBeRemoved() ? true : false;
  }
  setSpaceId(spaceId: T_UUID): void {
    this.spaceId = spaceId;
  }
  setRole(roleName: string): void {
    this.roleName = roleName;
  }
  setPermission(permission: z.infer<typeof permissionEnum>): void {
    this.permission = permission;
  }
  exportSpaceRoleData(): z.output<typeof spaceRolePersistenceSchema> {
    return spaceRolePersistenceSchema.parse(this.exportJson());
  }
  setTobeRemove(): boolean {
    this.changes.setToBeRemoved({ id: this.id });
    return true;
  }

  getSpaceId(): T_UUID {
    return this.spaceId;
  }
  getId(): T_UUID {
    return this.id;
  }
  getRole(): string {
    if (!this.roleName) throw new BadRequestException('Role name is not set');
    return this.roleName;
  }
  getPermission(): z.infer<typeof permissionEnum> {
    if (!this.permission)
      throw new BadRequestException('Permission is not set');
    return this.permission;
  }
}
