import { T_UUID } from '../../util/uuid';
import { User } from './user';

describe('User', () => {
  let user: User;
  const userEmail = 'testEmail@test.com';
  beforeEach(() => {
    user = new User();
    user.setProfile({
      email: userEmail,
      lastName: 'Doee',
      firstName: 'Johnn',
      profileImage: 'https://examplee.com',
    });
  });

  it('생성 확인', () => {
    expect(user).toBeTruthy();
  });

  it('setProfile 이전에 updateProfile 할시 에러 발생', () => {
    const user2 = new User();
    expect(() => {
      user2.updateProfile(
        {
          lastName: 'Doe',
          firstName: 'John',
          profileImage: 'https://example.com',
        },
        user2.getId(),
      );
    }).toThrow(/profile/);
  });

  it('프로필 조회시, 본인이 아닌경우 이메일을 제외한 프로필을 반환', () => {
    const beforeProfile = user.getProfile();
    expect(beforeProfile).toEqual({
      id: user.getId().exportString(),
      lastName: 'Doee',
      firstName: 'Johnn',
      profileImage: 'https://examplee.com',
    });
    user.updateProfile(
      {
        lastName: 'Doe',
        firstName: 'John',
        profileImage: 'https://example.com',
      },
      user.getId(),
    );
    const profile = user.getProfile();
    expect(profile).toEqual({
      id: user.getId().exportString(),
      lastName: 'Doe',
      firstName: 'John',
      profileImage: 'https://example.com',
    });
  });

  it('프로필 조회시, 본인인 경우 모든 프로필을 반환', () => {
    user.updateProfile(
      {
        lastName: 'Doe',
        firstName: 'John',
        profileImage: 'https://example.com',
      },
      user.getId(),
    );
    expect(user.getProfile(user.getId())).toEqual({
      id: user.getId().exportString(),
      email: userEmail,
      lastName: 'Doe',
      firstName: 'John',
      profileImage: 'https://example.com',
    });
  });

  it('본인이 아닌경우, 이메일을 제외한 프로필을 반환', () => {
    user.updateProfile(
      {
        lastName: 'Doe',
        firstName: 'John',
        profileImage: 'https://example.com',
      },
      user.getId(),
    );
    expect(user.getProfile(new T_UUID())).toEqual({
      id: user.getId().exportString(),
      lastName: 'Doe',
      firstName: 'John',
      profileImage: 'https://example.com',
    });
  });
});
