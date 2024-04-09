import { IUUIDTransable, T_UUID } from 'src/util/uuid';
import { z } from 'zod';

export const anonymousProfileSchema = z.object({
  lastName: z.string().default('anonymous'),
  firstName: z.string().default('anonymous'),
  profileImage: z.string().url().default('anonymous.png'),
});

export const registUserSchema = z.object({
  id: z
    .custom<IUUIDTransable>()
    .transform((val) => new T_UUID(val).exportBuffer()),
  email: z.string().email(),
  lastName: z.string(),
  firstName: z.string(),
  profileImage: z.string().url(),
  password: z.string(),
});

export const userSchema = z.object({
  id: z.custom<IUUIDTransable>().transform((val) => new T_UUID(val)),
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

export interface IUser {
  login(password: string): boolean;
  keepPassword(password: string): void;
  popPassword(): string | false;

  getId(): T_UUID;
  getProfile(requester?: T_UUID);
  getAnonymousProfile(): z.infer<typeof anonymousProfileSchema>;
  setProfile(profile: z.infer<typeof userSchema>): boolean;
  updateProfile(
    profile: z.infer<typeof updateProfileSchema>,
    requester: T_UUID,
  ): boolean;
}
