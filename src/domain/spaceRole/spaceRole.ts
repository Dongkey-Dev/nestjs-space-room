import { T_UUID } from 'src/util/uuid';
import { BaseDomain } from '../base/baseDomain';
import {
  ISpaceRole,
  permissionEnum,
  spaceRoleSchema,
} from './spaceRole.interface';
import { z } from 'zod';

export class SpaceRole
  extends BaseDomain<typeof spaceRoleSchema>
  implements BaseDomain<typeof spaceRoleSchema>, ISpaceRole
{
  id: T_UUID;
  spaceId: T_UUID;
  roleName: string;
  permission: z.infer<typeof permissionEnum>;
  constructor(data: z.infer<typeof spaceRoleSchema>) {
    super(spaceRoleSchema);
    this.import(data);
    if (!this.id) this.id = new T_UUID();
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
