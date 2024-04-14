import { IUUIDTransable, T_UUID } from 'src/util/uuid';
import { z } from 'zod';
import { ISpaceRole } from '../spaceRole/spaceRole.interface';
import { ISpace } from '../space/space.interface';

export const spaceMemberSchema = z.object({
  id: z.custom<IUUIDTransable>().transform((val) => new T_UUID(val)),
  spaceId: z.custom<IUUIDTransable>().transform((val) => new T_UUID(val)),
  userId: z.custom<IUUIDTransable>().transform((val) => new T_UUID(val)),
  roleId: z.custom<IUUIDTransable>().transform((val) => new T_UUID(val)),
});

export const spaceMemberPersistenceSchema = z.object({
  id: z
    .custom<IUUIDTransable>()
    .transform((val) => new T_UUID(val).exportBuffer()),
  spaceId: z
    .custom<IUUIDTransable>()
    .transform((val) => new T_UUID(val).exportBuffer()),
  userId: z
    .custom<IUUIDTransable>()
    .transform((val) => new T_UUID(val).exportBuffer()),
  roleId: z
    .custom<IUUIDTransable>()
    .transform((val) => new T_UUID(val).exportBuffer()),
});

export interface ISpaceMember {
  getId(): T_UUID;

  getUserId(): T_UUID;
  setUserId(userId: T_UUID): boolean;

  getRoleId(): T_UUID;
  setRoleId(roleId: T_UUID): boolean;

  setSpaceId(spaceId: T_UUID): boolean;
  getSpaceId(): T_UUID;

  changeRole(space: ISpace, requesterId: T_UUID, newRole: ISpaceRole): boolean;

  exportSpaceMemberData(): z.infer<typeof spaceMemberPersistenceSchema>;
}
