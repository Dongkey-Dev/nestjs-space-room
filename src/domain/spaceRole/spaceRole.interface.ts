import { IUUIDTransable, T_UUID } from 'src/util/uuid';
import { z } from 'zod';

export const permissionEnum = z.enum(['owner', 'admin', 'member']);
export const adminEnum = permissionEnum.exclude(['member']);
export const userPermissionEnum = permissionEnum.exclude(['owner']);

export const spaceRoleSchema = z.object({
  id: z.custom<IUUIDTransable>().transform((val) => new T_UUID(val)),
  spaceId: z.custom<IUUIDTransable>().transform((val) => new T_UUID(val)),
  roleName: z.string(),
  permission: permissionEnum,
});

export interface ISpaceRole {
  getId(): T_UUID;
  getSpaceId(): T_UUID;
  getRole(): string;
  getPermission(): z.infer<typeof permissionEnum>;
}
