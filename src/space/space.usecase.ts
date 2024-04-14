import { ISpace } from 'src/domain/space/space.interface';
import { exportSpaceEntryCodeSchema } from 'src/domain/spaceEntryCode/spaceEntryCode.interface';
import { ISpaceMember } from 'src/domain/spaceMember/spaceMember.interface';
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

export const joinedSpaceResponseSchema = z
  .object({
    spaceName: z.string(),
    spaceLogo: z.string(),
    roleName: z.string(),
    permission: permissionEnum,
  })
  .array();

export const createSpaceSchema = z
  .object({
    name: z.string(),
    logo: z.string(),
    ownerId: z.custom<IUUIDTransable>().transform((val) => new T_UUID(val)),
    roleList: roleSchema.array(),
  })
  .refine(checkRoleRefine);

export const joinSpaceSchema = z.object({
  inviteCode: z.string(),
});

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
  ): Promise<z.output<typeof exportSpaceEntryCodeSchema>[]>;
  join(userUuid: T_UUID, inviteCode: string): Promise<ISpaceMember>;
  getJoinedSpaces(
    userUuid: T_UUID,
  ): Promise<z.infer<typeof joinedSpaceResponseSchema>>;
  delete(useruuid: T_UUID, spaceUuid: T_UUID): Promise<boolean>;
}
