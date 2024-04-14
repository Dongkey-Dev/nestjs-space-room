import { T_UUID } from 'src/util/uuid';
import { ISpaceMember } from '../spaceMember/spaceMember.interface';
import { ISpaceRole, permissionEnum } from '../spaceRole/spaceRole.interface';
import { z } from 'zod';
import { SpaceMemberID } from './spaceMemberID';
import { ISpace } from '../space/space.interface';

describe('SpaceMemberId', () => {
  let adminSpaceMemberId: SpaceMemberID;
  let spaceMember: ISpaceMember;
  let adminSpaceRole: ISpaceRole;

  let memberSpaceRole: ISpaceRole;
  let memberSpaceMember: ISpaceMember;

  const spaceId = new T_UUID();
  const userId = new T_UUID();
  const adminPermission = 'admin';
  const memberPermission = 'member';
  beforeEach(() => {
    adminSpaceRole = new MockSpaceRole(spaceId, new T_UUID(), adminPermission);
    spaceMember = new MockSpaceMember(spaceId, userId, adminSpaceRole.getId());
    adminSpaceMemberId = new SpaceMemberID(spaceMember, adminSpaceRole);

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

  it('관리자의 관리자 확인', () => {
    expect(adminSpaceMemberId.isAdmin(spaceId)).toBeTruthy();
  });

  it('관리자의 멤버 확인', () => {
    expect(adminSpaceMemberId.isMember(spaceId)).toBeTruthy();
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

class MockSpaceMember implements ISpaceMember {
  spaceId: T_UUID;
  userId: T_UUID;
  roleId: T_UUID;
  constructor(spaceId: T_UUID, userId: T_UUID, roleId: T_UUID) {
    this.spaceId = spaceId;
    this.userId = userId;
    this.roleId = roleId;
  }
  changeRole(space: ISpace, requesterId: T_UUID, newRole: ISpaceRole): boolean {
    throw new BadRequestException('Method not implemented.');
  }
  setSpaceId(spaceId: T_UUID): boolean {
    throw new BadRequestException('Method not implemented.');
  }
  isJoined(): boolean {
    throw new BadRequestException('Method not implemented.');
  }
  getId(): T_UUID {
    throw new BadRequestException('Method not implemented.');
  }
  exportSpaceMemberData(): {
    id?: Buffer;
    spaceId?: Buffer;
    userId?: Buffer;
    roleId?: Buffer;
  } {
    throw new BadRequestException('Method not implemented.');
  }
  getUserId(): T_UUID {
    return this.userId;
  }
  setUserId(userId: T_UUID): boolean {
    throw new BadRequestException('Method not implemented.');
  }
  getRoleId(): T_UUID {
    return this.roleId;
  }
  setRoleId(roleId: T_UUID): boolean {
    throw new BadRequestException('Method not implemented.');
  }
  getSpaceId(): T_UUID {
    return this.spaceId;
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
  checkRemovableNoUse(member: ISpaceMember): boolean {
    throw new BadRequestException('Method not implemented.');
  }
  getName(): string {
    throw new BadRequestException('Method not implemented.');
  }
  exportSpaceRoleData(): {
    id: Buffer;
    spaceId: Buffer;
    name: string;
    isAdmin: boolean;
  } {
    throw new BadRequestException('Method not implemented.');
  }
  isTobeRemove(): boolean {
    throw new BadRequestException('Method not implemented.');
  }
  setSpaceId(spaceId: T_UUID): void {
    throw new BadRequestException('Method not implemented.');
  }
  setRole(roleName: string): void {
    throw new BadRequestException('Method not implemented.');
  }
  setPermission(permission: 'admin' | 'member'): void {
    throw new BadRequestException('Method not implemented.');
  }
  setTobeRemove(): boolean {
    throw new BadRequestException('Method not implemented.');
  }
  getId(): T_UUID {
    return this.id;
  }
  getSpaceId(): T_UUID {
    return this.spaceId;
  }
  getRole(): string {
    throw new BadRequestException('Method not implemented.');
  }
  getPermission(): 'admin' | 'member' {
    return this.permission;
  }
}
