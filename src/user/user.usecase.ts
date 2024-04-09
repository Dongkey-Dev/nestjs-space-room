import { IUser } from 'src/domain/user/user.interface';
import { T_UUID } from 'src/util/uuid';
import { z } from 'zod';

export interface LoginResult {
  user: IUser;
  accessToken: string;
  refreshToken: string;
}

export const createUserDtoSchema = z.object({
  email: z.string().email(),
  firstName: z.string(),
  lastName: z.string(),
  password: z.string(),
  profileImage: z.string().url(),
});

export const loginUserDtoSchema = z.object({
  email: z.string().email(),
  password: z.string(),
});

export const updateUserDtoSchema = z
  .object({
    firstName: z.string().optional(),
    lastName: z.string().optional(),
    password: z.string().optional(),
  })
  .refine(
    (data) => {
      return Object.keys(data).length > 0;
    },
    { message: 'At least one field is required' },
  );

export interface UserUsecase {
  loginUser(email: string, password: string): Promise<LoginResult>;
  createUser(dto: z.infer<typeof createUserDtoSchema>): Promise<IUser>;
  updateUser(
    id: T_UUID,
    dto: z.infer<typeof updateUserDtoSchema>,
  ): Promise<IUser>;
  getUser(id: T_UUID): Promise<IUser | []>;
}
