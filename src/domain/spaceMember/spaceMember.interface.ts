import { IUUIDTransable, T_UUID } from 'src/util/uuid';
import { z } from 'zod';
import { ISpaceRole } from '../spaceRole/spaceRole.interface';

export const spaceMemberSchema = z.object({
  id: z.custom<IUUIDTransable>().transform((val) => new T_UUID(val)),
  spaceId: z.custom<IUUIDTransable>().transform((val) => new T_UUID(val)),
  userId: z.custom<IUUIDTransable>().transform((val) => new T_UUID(val)),
  roleId: z.custom<IUUIDTransable>().transform((val) => new T_UUID(val)),
});

export interface ISpaceMember {
  getUserId(): T_UUID;
  setUserId(userId: T_UUID): boolean;
  getRoleId(): T_UUID;
  setRoleId(roleId: T_UUID): boolean;
  getSpaceId(): T_UUID;

  changeRole(
    requesterId: T_UUID,
    ownerMember: ISpaceMember,
    role: ISpaceRole,
  ): boolean;
}
