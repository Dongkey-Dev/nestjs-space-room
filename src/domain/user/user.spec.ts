import { BaseDomain } from '../base/baseDomain';
import { ISpace, IUser, anonymousProfileSchema } from '../domain.spec';
import { z } from 'zod';
import { DomainManager } from '../base/domainManager';
import { T_UUID } from '../../util/uuid';

export const userSchema = z.object({
  email: z.string().email(),
  lastName: z.string(),
  firstName: z.string(),
  profileImage: z.string().url(),
});

export const profileSchema = z.object({
  email: z.string().email().optional(),
  lastName: z.string(),
  firstName: z.string(),
  profileImage: z.string().url(),
});

export const updateProfileSchema = z.object({
  lastName: z.string().optional(),
  firstName: z.string().optional(),
  profileImage: z.string().url().optional(),
});

export class User
  extends BaseDomain<typeof userSchema>
  implements BaseDomain<typeof userSchema>, IUser
{
  private id: T_UUID;
  private email: string;
  private lastName: string;
  private firstName: string;
  private profileImage: string;

  private spaceManager: DomainManager<ISpace>;

  constructor(email: string, data?: z.input<typeof userSchema>) {
    super(userSchema);
    if (data) this.import(data);
    if (!this.id) this.id = new T_UUID();
    this.email = email;
  }
  getAnonymousProfile(): z.infer<typeof anonymousProfileSchema> {
    return anonymousProfileSchema.parse({});
  }
  getId(): T_UUID {
    return this.id;
  }
  getProfile(requester?: T_UUID) {
    if (requester && requester === this.id) return this.exportJson();
    else return this.exportJsonWithOmitSchema({ email: true });
  }
  setProfile(
    profile: Partial<z.infer<typeof userSchema>>,
    requester: T_UUID,
  ): boolean {
    if (!requester.isEqual(this.id))
      throw new Error('Only owner can change profile');
    const setResult = this.importPartial(profile);
    if (!setResult) throw new Error('Profile set failed');
    return setResult;
  }
}

describe('User', () => {
  let user: User;
  const userEmail = 'testEmail@test.com';
  beforeEach(() => {
    user = new User(userEmail);
  });

  it('생성 확인', () => {
    expect(user).toBeTruthy();
  });

  it('프로필 조회시, 본인이 아닌경우 이메일을 제외한 프로필을 반환', () => {
    const beforeProfile = user.getProfile();
    expect(beforeProfile).toEqual({});
    user.setProfile(
      {
        lastName: 'Doe',
        firstName: 'John',
        profileImage: 'https://example.com',
      },
      user.getId(),
    );
    const profile = user.getProfile();
    expect(profile).toEqual({
      lastName: 'Doe',
      firstName: 'John',
      profileImage: 'https://example.com',
    });
  });

  it('프로필 조회시, 본인인 경우 모든 프로필을 반환', () => {
    user.setProfile(
      {
        lastName: 'Doe',
        firstName: 'John',
        profileImage: 'https://example.com',
      },
      user.getId(),
    );
    expect(user.getProfile(user.getId())).toEqual({
      email: userEmail,
      lastName: 'Doe',
      firstName: 'John',
      profileImage: 'https://example.com',
    });
  });

  it('본인이 아닌경우, 이메일을 제외한 프로필을 반환', () => {
    user.setProfile(
      {
        lastName: 'Doe',
        firstName: 'John',
        profileImage: 'https://example.com',
      },
      user.getId(),
    );
    expect(user.getProfile(new T_UUID())).toEqual({
      lastName: 'Doe',
      firstName: 'John',
      profileImage: 'https://example.com',
    });
  });
});
