import { IUUIDTransable, T_UUID } from 'src/util/uuid';
import { z } from 'zod';
import { permissionEnum } from '../spaceRole/spaceRole.interface';

export const spaceMemberIDSchema = z.object({
  spaceId: z.custom<IUUIDTransable>().transform((val) => new T_UUID(val)),
  userId: z.custom<IUUIDTransable>().transform((val) => new T_UUID(val)),
  permission: permissionEnum,
});

export interface ISpaceMemberID {
  isOwner(spaceId: T_UUID): boolean;
  isAdmin(spaceId: T_UUID): boolean;
  isMember(spaceId: T_UUID): boolean;
  getUserId(): T_UUID;
}
