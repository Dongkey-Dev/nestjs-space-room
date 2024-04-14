import { T_UUID } from 'src/util/uuid';
import { ISpace } from '../space/space.interface';
import { ISpaceMember } from '../spaceMember/spaceMember.interface';
import { ISpaceRole } from '../spaceRole/spaceRole.interface';
import { SpaceEntryCode } from './spaceEntryCode';
import { ISpaceEntryCode } from './spaceEntryCode.interface';

describe('SpaceEntryCode', () => {
  let spaceEntryCode: ISpaceEntryCode;
  let space: ISpace;
  let spaceRole: ISpaceRole;
  beforeEach(() => {
    space = new MockSpace(new T_UUID());
    spaceRole = new MockSpaceRole(new T_UUID());
    spaceEntryCode = new SpaceEntryCode({
      id: new T_UUID(),
      spaceId: space.getId(),
      roleId: spaceRole.getId(),
      code: 'code1234',
    });
  });

  it('생성 확인', () => {
    expect(spaceEntryCode).toBeTruthy();
  });

  it('getId 확인', () => {
    expect(spaceEntryCode.getId()).toBeTruthy();
  });

  it('getSpaceId 확인', () => {
    expect(spaceEntryCode.getSpaceId()).toBeTruthy();
  });

  it('setSpaceId 확인', () => {
    spaceEntryCode.setSpaceId(space);
    expect(spaceEntryCode.getSpaceId()).toBe(space.getId());
  });

  it('getCode 확인', () => {
    expect(spaceEntryCode.getCode()).toBeTruthy();
  });

  it('getRoleId 확인', () => {
    expect(spaceEntryCode.getRoleId()).toBeTruthy();
  });

  it('setRoleId 확인', () => {
    spaceEntryCode.setRoleId(spaceRole);
    expect(spaceEntryCode.getRoleId()).toBe(spaceRole.getId());
  });
});

class MockSpace implements ISpace {
  id: T_UUID;
  constructor(id: T_UUID) {
    this.id = id;
  }
  setTobeRemove(requeser: T_UUID): void {
    throw new BadRequestException('Method not implemented.');
  }
  getId(): T_UUID {
    return this.id;
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
    throw new BadRequestException('Method not implemented.');
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
class MockSpaceRole implements ISpaceRole {
  id: T_UUID;
  constructor(id: T_UUID) {
    this.id = id;
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
  getId(): T_UUID {
    return this.id;
  }
  getSpaceId(): T_UUID {
    throw new BadRequestException('Method not implemented.');
  }
  setSpaceId(spaceId: T_UUID): void {
    throw new BadRequestException('Method not implemented.');
  }
  getRole(): string {
    throw new BadRequestException('Method not implemented.');
  }
  setRole(roleName: string): void {
    throw new BadRequestException('Method not implemented.');
  }
  getPermission(): 'admin' | 'member' {
    throw new BadRequestException('Method not implemented.');
  }
  setPermission(permission: 'admin' | 'member'): void {
    throw new BadRequestException('Method not implemented.');
  }
  setTobeRemove(): boolean {
    throw new BadRequestException('Method not implemented.');
  }
}
