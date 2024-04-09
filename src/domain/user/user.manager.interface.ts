import { z } from 'zod';
import { DomainManager } from '../base/domainManager';
import { User } from './user';

export const updateUserSchema = z
  .object({
    firstName: z.string().optional(),
    lastName: z.string().optional(),
    profileImage: z.string().optional(),
  })
  .refine((data) => {
    return Object.keys(data).length > 0;
  }, 'At least one field must be provided');

export interface IUserManager extends DomainManager<User> {
  registUser(user: User, password: string): Promise<User>;
  getUserForLogin(email: string): Promise<User>;
}
