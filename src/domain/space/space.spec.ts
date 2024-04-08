import { IUUIDTransable, T_UUID } from 'src/util/uuid';
import { BaseDomain } from '../base/baseDomain';
import { ISpace, ISpaceMember, ISpaceRole } from '../domain.spec';
import { z } from 'zod';

const spaceSchema = z.object({
  name: z.string(),
  logo: z.string().url(),
  ownerId: z.custom<IUUIDTransable>().transform((val) => new T_UUID(val)),
});

export class Space
  extends BaseDomain<typeof spaceSchema>
  implements BaseDomain<typeof spaceSchema>, ISpace
{
  private id: T_UUID;
  private name: string;
  private logo: string;
  private ownerId: T_UUID;
  constructor(data: z.infer<typeof spaceSchema>) {
    super(spaceSchema);
    this.import(data);
    if (!this.id) this.id = new T_UUID();
  }
  getOwnerId(): T_UUID {
    return this.ownerId;
  }
  getId(): T_UUID {
    return this.id;
  }
  getName(): string {
    if (!this.name) throw new Error('Name is not set');
    return this.name;
  }
  changeName(name: string, ownerMember: ISpaceMember): boolean {
    if (
      ownerMember.getSpaceId() === this.getId() &&
      ownerMember.getUserId() === this.ownerId
    ) {
      this.name = name;
      return true;
    }
    throw new Error('Only owner can change space name');
  }
  getLogo(): string {
    if (!this.logo) throw new Error('Logo is not set');
    return this.logo;
  }
  changeLogo(logo: string, ownerMember: ISpaceMember): boolean {
    if (
      ownerMember.getSpaceId() === this.getId() &&
      ownerMember.getUserId() === this.ownerId
    ) {
      this.logo = logo;
      return true;
    }
    throw new Error('Only owner can change space logo');
  }

  changeOwner(
    oldOwnerMember: ISpaceMember,
    newOwnerMember: ISpaceMember,
  ): boolean {
    if (
      oldOwnerMember.getSpaceId() === this.getId() &&
      oldOwnerMember.getUserId() === this.ownerId
    ) {
      this.ownerId = newOwnerMember.getUserId();
      return true;
    }
    throw new Error('Only owner can change owner');
  }
}

class MockSpaceMember implements ISpaceMember {
  userId: T_UUID;
  spaceId: T_UUID;
  constructor(userId: T_UUID, spaceId: T_UUID) {
    this.userId = userId;
    this.spaceId = spaceId;
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
});
