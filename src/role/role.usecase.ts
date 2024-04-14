import { roleSchema } from 'src/space/space.usecase';
import { T_UUID } from 'src/util/uuid';
import { z } from 'zod';

export const updateRoleSchema = z.object({
  targetUserUuid: z.string(),
  spaceId: z.string(),
  roleId: z.string(),
});

export const createRoleSchema = z.object({
  spaceId: z.string(),
  roleList: roleSchema.array(),
});

export interface RoleUsecase {
  updateUserRole(
    requesterUuid: T_UUID,
    targetUserUuid: T_UUID,
    spaceId: T_UUID,
    roleId: T_UUID,
  ): Promise<boolean>;
  addRole(
    requesterUuid: T_UUID,
    spaceUuid: T_UUID,
    roleList: z.infer<typeof roleSchema>[],
  );
  removeRole(
    requeterUuid: T_UUID,
    spaceUuid: T_UUID,
    roleId: T_UUID,
  ): Promise<boolean>;
}
