import { ISpace } from 'src/domain/space/space.interface';
import { ISpaceMemberID } from 'src/domain/spaceMemberID/spaceMemberID.interface';
import { permissionEnum } from 'src/domain/spaceRole/spaceRole.interface';
import { IUUIDTransable, T_UUID } from 'src/util/uuid';
import { z } from 'zod';

export const roleSchema = z.object({
  name: z.string(),
  permission: permissionEnum,
});

const checkRoleRefine = (val: any) => {
  val.roleList.length > 1 &&
    val.roleList.some((role) => role.permission === 'admin') &&
    val.roleList.some((role) => role.permission === 'member') &&
    val.roleList.some((role) => role.permission === 'owner'),
    {
      message: 'roleList must have admin, member, owner permission',
    };
};

export const createSpaceSchema = z
  .object({
    name: z.string(),
    logo: z.string(),
    ownerId: z.custom<IUUIDTransable>().transform((val) => new T_UUID(val)),
    roleList: roleSchema.array(),
  })
  .refine(checkRoleRefine);

export const updateSpaceSchema = z.object({
  name: z.string().optional(),
  logo: z.string().optional(),
});

export const changeOwnerSchema = z.object({
  newOwnerId: z.custom<IUUIDTransable>().transform((val) => new T_UUID(val)),
});

export interface SpaceUsecase {
  create(
    ownerUuid: T_UUID,
    dto: z.infer<typeof createSpaceSchema>,
  ): Promise<ISpace>;
  join(
    userUuid: T_UUID,
    inviteCode: string,
    roleName: string,
  ): Promise<ISpaceMemberID>;
  find(userUuid: T_UUID, spaceUuid: T_UUID): Promise<ISpace[]>;
  updateUserRole(targetUserUuid: T_UUID, roleId: T_UUID): Promise<void>;
  addRole(
    spaceUuid: T_UUID,
    roleList: z.infer<typeof roleSchema>,
  ): Promise<void>;
  removeRole(spaceUuid: T_UUID, roleId: T_UUID): Promise<void>;
}
