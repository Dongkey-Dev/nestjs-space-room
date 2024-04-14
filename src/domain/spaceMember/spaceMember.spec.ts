import { T_UUID } from 'src/util/uuid';
import { ISpaceRole } from '../spaceRole/spaceRole.interface';
import { SpaceMember } from './spaceMember';
import { ISpaceMember } from './spaceMember.interface';
import { ISpace } from '../space/space.interface';

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
    ownerMember.setUserId(requesterId);
    const space = new MockSpace(ownerMember.getUserId());
    oldRole.setId(oldRoleId);
    ownerMember.setRoleId(oldRole.getId());
    ownerMember.setUserId(requesterId);
    newRole.setId(new T_UUID());
    expect(spaceMember.changeRole(space, requesterId, newRole)).toBeTruthy();
  });
});

class MockSpaceRole implements ISpaceRole {
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
  setTobeRemove(): boolean {
    throw new BadRequestException('Method not implemented.');
  }
  getSpaceId(): T_UUID {
    throw new BadRequestException('Method not implemented.');
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
    throw new BadRequestException('Method not implemented.');
  }
  setRole(role: string): boolean {
    throw new BadRequestException('Method not implemented.');
  }
  getPermission(): 'admin' | 'member' {
    throw new BadRequestException('Method not implemented.');
  }
  setPermission(permission: 'admin' | 'member'): boolean {
    throw new BadRequestException('Method not implemented.');
  }
}

class MockSpace implements ISpace {
  ownerId: T_UUID;
  constructor(ownerId: T_UUID) {
    this.ownerId = ownerId;
  }
  getId(): T_UUID {
    throw new BadRequestException('Method not implemented.');
  }
  setTobeRemove(requeser: T_UUID): void {
    throw new BadRequestException('Method not implemented.');
  }
  getName(): string {
    throw new BadRequestException('Method not implemented.');
  }
  setName(name: string): void {
    throw new BadRequestException('Method not implemented.');
  }
  changeName(name: string, ownerMember: ISpaceMember): boolean {
    throw new BadRequestException('Method not implemented.');
  }
  getLogo(): string {
    throw new BadRequestException('Method not implemented.');
  }
  changeLogo(logo: string, ownerMember: ISpaceMember): boolean {
    throw new BadRequestException('Method not implemented.');
  }
  setLogo(logo: string): void {
    throw new BadRequestException('Method not implemented.');
  }
  getOwnerId(): T_UUID {
    return this.ownerId;
  }
  changeOwner(
    oldOwnerMember: ISpaceMember,
    newOwnerMember: ISpaceMember,
  ): boolean {
    throw new BadRequestException('Method not implemented.');
  }
  removeRole(requester: T_UUID, spaceRole: ISpaceRole): boolean {
    throw new BadRequestException('Method not implemented.');
  }
  exportSpaceData(): {
    id?: Buffer;
    name?: string;
    logo?: string;
    ownerId?: Buffer;
  } {
    throw new BadRequestException('Method not implemented.');
  }
}
