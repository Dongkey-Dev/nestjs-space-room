import { ISpace } from 'src/domain/space/space.interface';
import { userPermissionEnum } from 'src/domain/spaceRole/spaceRole.interface';
import { IUUIDTransable, T_UUID } from 'src/util/uuid';
import { z } from 'zod';

export const createSpaceSchema = z.object({
  name: z.string(),
  logo: z.string(),
  ownerId: z.custom<IUUIDTransable>().transform((val) => new T_UUID(val)),
});

export const roleSchema = z.object({
  name: z.string(),
  permission: userPermissionEnum,
});

export const updateSpaceSchema = z.object({
  name: z.string().optional(),
  logo: z.string().optional(),
});

export const changeOwnerSchema = z.object({
  newOwnerId: z.custom<IUUIDTransable>().transform((val) => new T_UUID(val)),
});

export interface SpaceUsecase {
  createSpace(dto: z.infer<typeof createSpaceSchema>): Promise<ISpace>;
}
