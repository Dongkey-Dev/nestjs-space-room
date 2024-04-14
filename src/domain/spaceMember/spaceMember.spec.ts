import { T_UUID } from 'src/util/uuid';
import { ISpaceRole } from '../spaceRole/spaceRole.interface';
import { SpaceMember } from './spaceMember';
import { ISpaceMember } from './spaceMember.interface';

describe('SpaceMember', () => {
  let spaceMember: ISpaceMember;
  beforeEach(() => {
    spaceMember = new SpaceMember();
  });

  it('생성 확인', () => {
    expect(spaceMember).toBeTruthy();
  });

  it('유저 아이디 설정 확인', () => {
    const userId = new T_UUID();
    spaceMember.setUserId(userId);
    expect(spaceMember.getUserId()).toEqual(userId);
  });

  it('역할 아이디 설정 확인', () => {
    const roleId = new T_UUID();
    spaceMember.setRoleId(roleId);
    expect(spaceMember.getRoleId()).toEqual(roleId);
  });

  it('스페이스 아이디 설정 확인', () => {
    const spaceId = new T_UUID();
    spaceMember.setSpaceId(spaceId);
    expect(spaceMember.getSpaceId()).toEqual(spaceId);
  });

  it('설정하지 않은 속성 조회시 에러 발생', () => {
    expect(() => spaceMember.getUserId()).toThrow();
    expect(() => spaceMember.getRoleId()).toThrow();
    expect(() => spaceMember.getSpaceId()).toThrow();
  });

  it('역할 변경 확인', () => {
    const requesterId = new T_UUID();
    const ownerMember = new SpaceMember();
    const newRole = new MockSpaceRole();
    const oldRole = new MockSpaceRole();
    const oldRoleId = new T_UUID();
    oldRole.setId(oldRoleId);
    ownerMember.setRoleId(oldRole.getId());
    ownerMember.setUserId(requesterId);
    newRole.setId(new T_UUID());
    expect(
      spaceMember.changeRole(requesterId, ownerMember, newRole),
    ).toBeTruthy();
  });

  it('spaceId 혹은 roleId가 설정되지 않은 경우, 참여중이 아니다', () => {
    expect(spaceMember.isJoined()).toBeFalsy();
  });

  it('spaceId와 roleId가 설정된 경우, 참여중이다', () => {
    spaceMember.setSpaceId(new T_UUID());
    spaceMember.setRoleId(new T_UUID());
    expect(spaceMember.isJoined()).toBeTruthy();
  });
});

class MockSpaceRole implements ISpaceRole {
  exportSpaceRoleData(): {
    id: Buffer;
    spaceId: Buffer;
    name: string;
    isAdmin: boolean;
  } {
    throw new Error('Method not implemented.');
  }
  isTobeRemove(): boolean {
    throw new Error('Method not implemented.');
  }
  setSpaceId(spaceId: T_UUID): void {
    throw new Error('Method not implemented.');
  }
  setTobeRemove(): boolean {
    throw new Error('Method not implemented.');
  }
  getSpaceId(): T_UUID {
    throw new Error('Method not implemented.');
  }
  id: T_UUID;
  setId(id: T_UUID): boolean {
    this.id = id;
    return true;
  }
  getId(): T_UUID {
    return this.id;
  }
  getRole(): string {
    throw new Error('Method not implemented.');
  }
  setRole(role: string): boolean {
    throw new Error('Method not implemented.');
  }
  getPermission(): 'admin' | 'member' {
    throw new Error('Method not implemented.');
  }
  setPermission(permission: 'admin' | 'member'): boolean {
    throw new Error('Method not implemented.');
  }
}
