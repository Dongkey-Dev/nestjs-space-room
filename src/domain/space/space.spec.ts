import { T_UUID } from 'src/util/uuid';
import { ISpaceMember } from '../spaceMember/spaceMember.interface';
import { ISpaceRole } from '../spaceRole/spaceRole.interface';
import { Space } from './space';

describe('Space', () => {
  let space: Space;
  beforeEach(() => {
    space = new Space({
      name: 'test',
      logo: 'https://test.com',
      ownerId: new T_UUID(),
    });
  });

  it('생성 확인', () => {
    expect(space).toBeTruthy();
  });

  it('공간 이름 설정 확인', () => {
    const name = 'test2';
    const ownerMember = new MockSpaceMember(space.getOwnerId(), space.getId());
    space.changeName(name, ownerMember);
    expect(space.getName()).toEqual(name);
  });

  it('공간 로고 설정 확인', () => {
    const logo = 'https://test2.com';
    const ownerMember = new MockSpaceMember(space.getOwnerId(), space.getId());
    space.changeLogo(logo, ownerMember);
    expect(space.getLogo()).toEqual(logo);
  });

  it('권한이 없는 사용자가 이름 설정시 에러 발생', () => {
    const name = 'test2';
    const ownerMember = new MockSpaceMember(new T_UUID(), space.getId());
    expect(() => space.changeName(name, ownerMember)).toThrow();
  });

  it('권한이 없는 사용자가 로고 설정시 에러 발생', () => {
    const logo = 'https://test2.com';
    const ownerMember = new MockSpaceMember(new T_UUID(), space.getId());
    expect(() => space.changeLogo(logo, ownerMember)).toThrow();
  });

  it('소유자 변경 확인', () => {
    const oldOwnerMember = new MockSpaceMember(
      space.getOwnerId(),
      space.getId(),
    );
    const newOwnerMember = new MockSpaceMember(new T_UUID(), space.getId());
    space.changeOwner(oldOwnerMember, newOwnerMember);
    expect(space.getOwnerId()).toEqual(newOwnerMember.getUserId());
  });

  it('소유자 변경 실패 확인', () => {
    const oldOwnerMember = new MockSpaceMember(new T_UUID(), space.getId());
    const newOwnerMember = new MockSpaceMember(new T_UUID(), space.getId());
    expect(() => space.changeOwner(oldOwnerMember, newOwnerMember)).toThrow();
  });

  it('소유자 Role 삭제 확인', () => {
    const mockSpaceRole = new MockSpaceRole(
      space.getId(),
      new T_UUID(),
      'admin',
    );
    space.removeRole(space.getOwnerId(), mockSpaceRole);
    expect(mockSpaceRole.setTobeRemove()).toBeTruthy();
  });

  it('소유자 Role 삭제 실패 확인', () => {
    const mockSpaceRole = new MockSpaceRole(
      space.getId(),
      new T_UUID(),
      'member',
    );
    expect(() => space.removeRole(new T_UUID(), mockSpaceRole)).toThrow();
  });
});

class MockSpaceRole implements ISpaceRole {
  id: T_UUID;
  spaceId: T_UUID;
  roleName: string;
  permission: 'admin' | 'member';
  constructor(spaceId: T_UUID, id: T_UUID, permission: 'admin' | 'member') {
    this.spaceId = spaceId;
    this.id = id;
    this.permission = permission;
  }
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
  setRole(roleName: string): void {
    throw new Error('Method not implemented.');
  }
  setPermission(permission: 'admin' | 'member'): void {
    throw new Error('Method not implemented.');
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
  getPermission(): 'admin' | 'member' {
    throw new Error('Method not implemented.');
  }
  setTobeRemove(): boolean {
    return true;
  }
}

class MockSpaceMember implements ISpaceMember {
  userId: T_UUID;
  spaceId: T_UUID;
  constructor(userId: T_UUID, spaceId: T_UUID) {
    this.userId = userId;
    this.spaceId = spaceId;
  }
  setSpaceId(spaceId: T_UUID): boolean {
    throw new Error('Method not implemented.');
  }
  isJoined(): boolean {
    throw new Error('Method not implemented.');
  }
  getId(): T_UUID {
    throw new Error('Method not implemented.');
  }
  exportSpaceMemberData(): {
    id?: Buffer;
    spaceId?: Buffer;
    userId?: Buffer;
    roleId?: Buffer;
  } {
    throw new Error('Method not implemented.');
  }
  changeRole(
    requesterId: T_UUID,
    ownerMember: ISpaceMember,
    role: ISpaceRole,
  ): boolean {
    throw new Error('Method not implemented.');
  }
  getUserId(): T_UUID {
    return this.userId;
  }
  setUserId(userId: T_UUID): boolean {
    throw new Error('Method not implemented.');
  }
  getRoleId(): T_UUID {
    throw new Error('Method not implemented.');
  }
  setRoleId(roleId: T_UUID): boolean {
    throw new Error('Method not implemented.');
  }
  getSpaceId(): T_UUID {
    return this.spaceId;
  }
}
