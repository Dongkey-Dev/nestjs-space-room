import { IUUIDTransable, T_UUID } from 'src/util/uuid';
import { BaseDomain } from '../base/baseDomain';
import { ISpaceRole } from '../domain.spec';
import { z } from 'zod';
export const permissionEnum = z.enum(['owner', 'admin', 'member']);
export const adminEnum = z.enum(['owner', 'admin']);

export const spaceRoleSchema = z.object({
  id: z.custom<IUUIDTransable>().transform((val) => new T_UUID(val)),
  spaceId: z.custom<IUUIDTransable>().transform((val) => new T_UUID(val)),
  roleName: z.string(),
  permission: permissionEnum,
});

export class SpaceRole
  extends BaseDomain<typeof spaceRoleSchema>
  implements BaseDomain<typeof spaceRoleSchema>, ISpaceRole
{
  id: T_UUID;
  spaceId: T_UUID;
  roleName: string;
  permission: z.infer<typeof permissionEnum>;
  constructor(data?: z.infer<typeof spaceRoleSchema>) {
    super(spaceRoleSchema);
    if (data) this.import(data);
    this.id = new T_UUID();
  }
  getId(): T_UUID {
    return this.id;
  }
  getRole(): string {
    if (!this.roleName) throw new Error('Role name is not set');
    return this.roleName;
  }
  setRole(role: string): boolean {
    this.roleName = role;
    return true;
  }
  getPermission(): z.infer<typeof permissionEnum> {
    if (!this.permission) throw new Error('Permission is not set');
    return this.permission;
  }
  setPermission(permission: z.infer<typeof permissionEnum>): boolean {
    this.permission = permission;
    return true;
  }
}

describe('SpaceRole', () => {
  let spaceRole: SpaceRole;
  beforeEach(() => {
    spaceRole = new SpaceRole();
  });

  it('생성 확인', () => {
    expect(spaceRole).toBeTruthy();
  });

  it('역할 설정 확인', () => {
    const roleName = 'admin';
    spaceRole.setRole(roleName);
    expect(spaceRole.getRole()).toEqual(roleName);
  });

  it('권한 설정 확인', () => {
    const permission = 'admin';
    spaceRole.setPermission(permission);
    expect(spaceRole.getPermission()).toEqual(permission);
  });
});
