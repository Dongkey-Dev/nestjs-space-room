import { BaseDomain } from '../base/baseDomain';
import { ISpace, IUser } from '../domain.spec';
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
    this.id = new T_UUID();
    this.email = email;
  }

  createSpace(): Promise<ISpace> {
    const space = this.spaceManager.createDomain();
    space.setOwner(this);
    return this.spaceManager
      .applyDomain(space)
      .then(() => {
        return space;
      })
      .catch((e) => {
        throw e;
      });
  }
  getProfile(requester?: T_UUID): z.infer<typeof profileSchema> {
    if (requester && requester === this.id) {
      return this.exportJson();
    }
    return this.exportJsonWithOmitSchema({ email: true });
  }

  getId(): T_UUID {
    return this.id;
  }

  setProfile(profile: z.infer<typeof updateProfileSchema>) {
    this.importPartial(profile);
  }
  getJoiningSpaces(): Promise<ISpace[]> {
    return this.spaceManager
      .getDomainList(this.id)
      .then((spaces) => {
        return spaces;
      })
      .catch((e) => {
        throw e;
      });
  }

  setSpaceManager(spaceManager: DomainManager<ISpace>) {
    this.spaceManager = spaceManager;
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
    user.setProfile({
      lastName: 'Doe',
      firstName: 'John',
      profileImage: 'https://example.com',
    });
    const profile = user.getProfile();
    expect(profile).toEqual({
      lastName: 'Doe',
      firstName: 'John',
      profileImage: 'https://example.com',
    });
  });

  it('프로필 조회시, 본인인 경우 모든 프로필을 반환', () => {
    const beforeProfile = user.getProfile(user.getId());
    expect(beforeProfile).toEqual({
      email: userEmail,
    });
  });
});
