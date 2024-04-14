import { T_UUID } from 'src/util/uuid';
import { BaseDomain } from '../base/baseDomain';
import {
  ISpaceRole,
  permissionEnum,
  spaceRolePersistenceSchema,
  spaceRoleSchema,
} from './spaceRole.interface';
import { z } from 'zod';

export class SpaceRole
  extends BaseDomain<typeof spaceRoleSchema>
  implements BaseDomain<typeof spaceRoleSchema>, ISpaceRole
{
  private id: T_UUID;
  private spaceId: T_UUID;
  private roleName: string;
  private permission: z.infer<typeof permissionEnum>;
  constructor(data?: z.infer<typeof spaceRoleSchema>) {
    super(spaceRoleSchema);
    if (!data.id) data.id = new T_UUID();
    this.import(data);
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
    if (!this.roleName) throw new Error('Role name is not set');
    return this.roleName;
  }
  getPermission(): z.infer<typeof permissionEnum> {
    if (!this.permission) throw new Error('Permission is not set');
    return this.permission;
  }
}
