import { z } from 'zod';
import {
  ISpaceMember,
  ISpaceMemberID,
  ISpaceRole,
  permissionEnum,
} from '../domain.spec';
import { IUUIDTransable, T_UUID } from 'src/util/uuid';
import { BaseDomain } from '../base/baseDomain';

export const spaceMemberIDSchema = z.object({
  spaceId: z.custom<IUUIDTransable>().transform((val) => new T_UUID(val)),
  userId: z.custom<IUUIDTransable>().transform((val) => new T_UUID(val)),
  permission: permissionEnum,
});

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
      throw new Error('SpaceMemberId generation failed');
    }
  }
  getUserId(): T_UUID {
    return this.userId;
  }
  isOwner(spaceId: T_UUID): boolean {
    if (this.spaceId.isEqual(spaceId) && this.permission === 'owner')
      return true;
    return false;
  }
  isAdmin(spaceId: T_UUID): boolean {
    if (
      this.spaceId.isEqual(spaceId) &&
      (this.permission === 'admin' || this.permission === 'owner')
    )
      return true;
    return false;
  }
  isMember(spaceId: T_UUID): boolean {
    if (this.spaceId.isEqual(spaceId)) return true;
    return false;
  }
}

class MockSpaceMember implements ISpaceMember {
  spaceId: T_UUID;
  userId: T_UUID;
  roleId: T_UUID;
  constructor(spaceId: T_UUID, userId: T_UUID, roleId: T_UUID) {
    this.spaceId = spaceId;
    this.userId = userId;
    this.roleId = roleId;
  }
  getUserId(): T_UUID {
    return this.userId;
  }
  setUserId(userId: T_UUID): boolean {
    throw new Error('Method not implemented.');
  }
  getRoleId(): T_UUID {
    return this.roleId;
  }
  setRoleId(roleId: T_UUID): boolean {
    throw new Error('Method not implemented.');
  }
  getSpaceId(): T_UUID {
    return this.spaceId;
  }
  changeRole(
    requesterId: T_UUID,
    ownerMember: ISpaceMember,
    role: ISpaceRole,
  ): boolean {
    throw new Error('Method not implemented.');
  }
}

class MockSpaceRole implements ISpaceRole {
  spaceId: T_UUID;
  id: T_UUID;
  permission: z.infer<typeof permissionEnum>;

  constructor(
    spaceId: T_UUID,
    id: T_UUID,
    permission: z.infer<typeof permissionEnum>,
  ) {
    this.spaceId = spaceId;
    this.id = id;
    this.permission = permission;
  }
  getId(): T_UUID {
    return this.id;
  }
  getSpaceId(): T_UUID {
    return this.spaceId;
  }
  getRole(): string {
    throw new Error('Method not implemented.');
  }
  getPermission(): 'owner' | 'admin' | 'member' {
    return this.permission;
  }
}

describe('SpaceMemberId', () => {
  let adminSpaceMemberId: SpaceMemberID;
  let spaceMember: ISpaceMember;
  let adminSpaceRole: ISpaceRole;

  let ownerSpaceRole: ISpaceRole;
  let ownerSpaceMember: ISpaceMember;

  let memberSpaceRole: ISpaceRole;
  let memberSpaceMember: ISpaceMember;

  const spaceId = new T_UUID();
  const userId = new T_UUID();
  const adminPermission = 'admin';
  const onwerPermission = 'owner';
  const memberPermission = 'member';
  beforeEach(() => {
    adminSpaceRole = new MockSpaceRole(spaceId, new T_UUID(), adminPermission);
    spaceMember = new MockSpaceMember(spaceId, userId, adminSpaceRole.getId());
    adminSpaceMemberId = new SpaceMemberID(spaceMember, adminSpaceRole);

    ownerSpaceRole = new MockSpaceRole(spaceId, new T_UUID(), onwerPermission);
    ownerSpaceMember = new MockSpaceMember(
      spaceId,
      userId,
      ownerSpaceRole.getId(),
    );

    memberSpaceRole = new MockSpaceRole(
      spaceId,
      new T_UUID(),
      memberPermission,
    );
    memberSpaceMember = new MockSpaceMember(
      spaceId,
      userId,
      memberSpaceRole.getId(),
    );
  });

  it('생성 확인', () => {
    expect(adminSpaceMemberId).toBeTruthy();
  });

  it('사용자 ID 확인', () => {
    expect(adminSpaceMemberId.getUserId()).toEqual(userId);
  });

  it('관리자의 소유자 확인', () => {
    expect(adminSpaceMemberId.isOwner(spaceId)).toBeFalsy();
  });

  it('관리자의 관리자 확인', () => {
    expect(adminSpaceMemberId.isAdmin(spaceId)).toBeTruthy();
  });

  it('관리자의 멤버 확인', () => {
    expect(adminSpaceMemberId.isMember(spaceId)).toBeTruthy();
  });

  it('소유자의 소유자 확인', () => {
    const ownerSpaceMemberId = new SpaceMemberID(
      ownerSpaceMember,
      ownerSpaceRole,
    );
    expect(ownerSpaceMemberId.isOwner(spaceId)).toBeTruthy();
  });

  it('소유자의 관리자 확인', () => {
    const ownerSpaceMemberId = new SpaceMemberID(
      ownerSpaceMember,
      ownerSpaceRole,
    );
    expect(ownerSpaceMemberId.isAdmin(spaceId)).toBeTruthy();
  });

  it('소유자의 멤버 확인', () => {
    const ownerSpaceMemberId = new SpaceMemberID(
      ownerSpaceMember,
      ownerSpaceRole,
    );
    expect(ownerSpaceMemberId.isMember(spaceId)).toBeTruthy();
  });

  it('멤버의 소유자 확인', () => {
    const memberSpaceMemberId = new SpaceMemberID(
      memberSpaceMember,
      memberSpaceRole,
    );
    expect(memberSpaceMemberId.isOwner(spaceId)).toBeFalsy();
  });

  it('멤버의 관리자 확인', () => {
    const memberSpaceMemberId = new SpaceMemberID(
      memberSpaceMember,
      memberSpaceRole,
    );
    expect(memberSpaceMemberId.isAdmin(spaceId)).toBeFalsy();
  });

  it('멤버의 멤버 확인', () => {
    const memberSpaceMemberId = new SpaceMemberID(
      memberSpaceMember,
      memberSpaceRole,
    );
    expect(memberSpaceMemberId.isMember(spaceId)).toBeTruthy();
  });

  it('SpaceMemberId 생성 실패', () => {
    const spaceRole2 = new MockSpaceRole(
      spaceId,
      new T_UUID(),
      adminPermission,
    );
    const spaceMember2 = new MockSpaceMember(
      spaceId,
      userId,
      spaceRole2.getId(),
    );
    expect(() => new SpaceMemberID(spaceMember2, adminSpaceRole)).toThrow();
  });

  it('SpaceMemberId 생성 실패', () => {
    const spaceRole2 = new MockSpaceRole(
      new T_UUID(),
      new T_UUID(),
      adminPermission,
    );
    const spaceMember2 = new MockSpaceMember(
      spaceId,
      userId,
      spaceRole2.getId(),
    );
    expect(() => new SpaceMemberID(spaceMember2, adminSpaceRole)).toThrow();
  });
});
