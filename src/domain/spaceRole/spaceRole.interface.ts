import { IUUIDTransable, T_UUID } from 'src/util/uuid';
import { z } from 'zod';

export const permissionEnum = z.enum(['admin', 'member']);
export const adminEnum = permissionEnum.exclude(['member']);

export const spaceRoleSchema = z.object({
  id: z.custom<IUUIDTransable>().transform((val) => new T_UUID(val)),
  spaceId: z.custom<IUUIDTransable>().transform((val) => new T_UUID(val)),
  roleName: z.string(),
  permission: permissionEnum,
});

export const spaceRolePersistenceSchema = z
  .object({
    id: z
      .custom<IUUIDTransable>()
      .transform((val) => new T_UUID(val).exportBuffer()),
    spaceId: z
      .custom<IUUIDTransable>()
      .transform((val) => new T_UUID(val).exportBuffer()),
    roleName: z.string(),
    permission: permissionEnum,

    name: z.string().optional(),
    isAdmin: z.boolean().optional(),
  })
  .transform((val) => {
    return {
      id: val.id,
      spaceId: val.spaceId,
      name: val.roleName,
      isAdmin: val.permission === 'admin' ? true : false,
    };
  });

export interface ISpaceRole {
  exportSpaceRoleData(): z.output<typeof spaceRolePersistenceSchema>;

  isTobeRemove(): boolean;

  getId(): T_UUID;
  getSpaceId(): T_UUID;
  setSpaceId(spaceId: T_UUID): void;

  getRole(): string;
  setRole(roleName: string): void;

  getName(): string;

  getPermission(): z.infer<typeof permissionEnum>;
  setPermission(permission: z.infer<typeof permissionEnum>): void;

  setTobeRemove(): boolean;
}
