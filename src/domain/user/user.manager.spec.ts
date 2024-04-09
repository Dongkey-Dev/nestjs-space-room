import { T_UUID } from 'src/util/uuid';
import { UserManager } from './user.manager';
import { IUserRepository } from './user.repository';
import { BaseDomain } from '../base/baseDomain';
import { z } from 'zod';
import { IUser, registUserSchema, userSchema } from './user.interface';
import { User } from './user';

class MockUser implements IUser {
  id: T_UUID;
  email: string;
  firstName: string;
  lastName: string;
  profileImage: string;
  constructor(
    email: string,
    firstName: string,
    lastName: string,
    profileImage: string,
  ) {
    this.id = new T_UUID();
    this.email = email;
    this.firstName = firstName;
    this.lastName = lastName;
    this.profileImage = profileImage;
  }
  login(password: string): boolean {
    throw new Error('Method not implemented.');
  }
  keepPassword(password: string): void {
    throw new Error('Method not implemented.');
  }
  popPassword(): string {
    throw new Error('Method not implemented.');
  }

  getId(): T_UUID {
    return this.id;
  }
  getProfile(requester?: T_UUID) {
    if (requester === this.id) {
      return {
        email: this.email,
        firstName: this.firstName,
        lastName: this.lastName,
        profileImage: this.profileImage,
      };
    }
    return {
      email: this.email,
      firstName: this.firstName,
      lastName: this.lastName,
    };
  }
  getAnonymousProfile(): {
    lastName?: string;
    firstName?: string;
    profileImage?: string;
  } {
    throw new Error('Method not implemented.');
  }
  setProfile(profile: {
    id?: T_UUID;
    email?: string;
    lastName?: string;
    firstName?: string;
    profileImage?: string;
  }): boolean {
    throw new Error('Method not implemented.');
  }
  updateProfile(
    profile: { lastName?: string; firstName?: string; profileImage?: string },
    requester: T_UUID,
  ): boolean {
    this.lastName = profile.lastName;
    this.firstName = profile.firstName;
    this.profileImage = profile.profileImage;
    return true;
  }
}

class MockUserRepository implements IUserRepository {
  getUserForLogin(email: string): Promise<IUser> {
    throw new Error('Method not implemented.');
  }
  registUser(userData: z.infer<typeof registUserSchema>): Promise<boolean> {
    throw new Error('Method not implemented.');
  }
  saveUser(user: IUser & BaseDomain<typeof userSchema>): Promise<boolean> {
    return Promise.resolve(true);
  }
  getUser(id: T_UUID): Promise<IUser> {
    return Promise.resolve(
      new MockUser('test@email.com', 'test', 'test', 'test.png'),
    );
  }
  softRemoveUser(id: T_UUID): Promise<boolean> {
    throw new Error('Method not implemented.');
  }
}

describe('UserManager', () => {
  let user: IUser;
  let userManager: UserManager;
  let mockUserRepository: IUserRepository;

  beforeEach(() => {
    mockUserRepository = new MockUserRepository();
    userManager = new UserManager(mockUserRepository);
    user = new MockUser('test@email.com', 'test', 'test', 'test.png');
  });

  it('생성 확인', () => {
    expect(userManager).toBeDefined();
  });

  it('유저 생성', async () => {
    const result = await userManager.createDomain();
    expect(result).toBeDefined();
  });

  it('유저 조회', async () => {
    const result = await userManager.getDomain(user.getId());
    expect(result).toBeDefined();
  });

  it('유저 업데이트', async () => {
    user.updateProfile(
      {
        lastName: 'updated',
        firstName: 'updated',
        profileImage: 'updated',
      },
      user.getId(),
    );
    const result = await userManager.applyDomain(user as User);
    expect(result).toBeDefined();
  });
});
