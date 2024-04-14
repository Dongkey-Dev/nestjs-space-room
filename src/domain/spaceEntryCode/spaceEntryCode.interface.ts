import { z } from 'zod';
import { ISpace } from '../space/space.interface';
import { ISpaceRole } from '../spaceRole/spaceRole.interface';
import { IUUIDTransable, T_UUID } from 'src/util/uuid';

export const spaceEntryCodeSchema = z.object({
  id: z.custom<IUUIDTransable>().transform((val) => new T_UUID(val)),
  spaceId: z.custom<IUUIDTransable>().transform((val) => new T_UUID(val)),
  code: z.string().length(8),
  roleId: z.custom<IUUIDTransable>().transform((val) => new T_UUID(val)),
});

export const spaceEntryCodePersistenceSchema = z.object({
  id: z
    .custom<IUUIDTransable>()
    .transform((val) => new T_UUID(val).exportBuffer()),
  spaceId: z
    .custom<IUUIDTransable>()
    .transform((val) => new T_UUID(val).exportBuffer()),
  code: z.string().length(8),
  roleId: z
    .custom<IUUIDTransable>()
    .transform((val) => new T_UUID(val).exportBuffer()),
});

export interface ISpaceEntryCode {
  isTobeRemove(): boolean;
  exportPersistenceData(): z.output<typeof spaceEntryCodePersistenceSchema>;

  getId(): T_UUID;

  getSpaceId(): T_UUID;
  setSpaceId(space: ISpace): void;

  getCode(): string;

  getRoleId(): T_UUID;
  setRoleId(role: ISpaceRole): void;

  generateCode(): string;
}
