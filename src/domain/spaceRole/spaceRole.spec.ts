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
  constructor(data: z.infer<typeof spaceRoleSchema>) {
    super(spaceRoleSchema);
    this.import(data);
    this.id = new T_UUID();
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

describe('SpaceRole', () => {
  let spaceRole: SpaceRole;
  const permission = 'admin';
  const roleName = 'admin';
  beforeEach(() => {
    spaceRole = new SpaceRole({
      id: new T_UUID(),
      spaceId: new T_UUID(),
      roleName: roleName,
      permission: permission,
    });
  });

  it('생성 확인', () => {
    expect(spaceRole).toBeTruthy();
  });

  it('역할 설정 확인', () => {
    expect(spaceRole.getRole()).toEqual(roleName);
  });

  it('권한 설정 확인', () => {
    expect(spaceRole.getPermission()).toEqual(permission);
  });
});
