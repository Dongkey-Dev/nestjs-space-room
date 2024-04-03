import { T_UUID } from 'src/util/uuid';
import { z } from 'zod';

/**
 ### User
1. 유저는 이메일, 성, 이름, 프로필 사진을 갖습니다.
2. 다른 유저의 프로필을 조회할 수 있습니다. 단, 다른 유저의 이메일은 조회할 수 없습니다.
3. 유저는 자신의 프로필을 조회하고, 이메일을 제외한 나머지를 수정할 수 있습니다.
4. 유저는 자신이 작성한 글 목록 및 댓글 목록을 모아볼 수 있습니다.
 */

const userSchema = z.object({
  email: z.string().email(),
  lastName: z.string(),
  firstName: z.string(),
  profileImage: z.string().url(),
});

const profileSchema = z.object({
  email: z.string().email().optional(),
  lastName: z.string(),
  firstName: z.string(),
  profileImage: z.string().url(),
});

const updateProfileSchema = z.object({
  lastName: z.string().optional(),
  firstName: z.string().optional(),
  profileImage: z.string().url().optional(),
});

interface IUser {
  getProfile(requester: T_UUID): z.infer<typeof profileSchema>;
  updateProfile(profile: z.infer<typeof updateProfileSchema>): void;
}
