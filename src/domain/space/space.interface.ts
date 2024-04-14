import { IUUIDTransable, T_UUID } from 'src/util/uuid';
import { z } from 'zod';
import { ISpaceMember } from '../spaceMember/spaceMember.interface';
import { ISpaceRole } from '../spaceRole/spaceRole.interface';

export const spaceSchema = z.object({
  id: z.custom<IUUIDTransable>().transform((val) => new T_UUID(val)),
  name: z.string(),
  logo: z.string(),
  ownerId: z.custom<IUUIDTransable>().transform((val) => new T_UUID(val)),
  createdAt: z.date().optional(),
  updatedAt: z.date().optional(),
});

export const spacePersistenceSchema = z.object({
  id: z
    .custom<IUUIDTransable>()
    .transform((val) => new T_UUID(val).exportBuffer()),
  name: z.string().optional(),
  logo: z.string().optional(),
  ownerId: z
    .custom<IUUIDTransable>()
    .transform((val) => new T_UUID(val).exportBuffer())
    .optional(),
});

export interface ISpace {
  getId(): T_UUID;

  getName(): string;
  setName(name: string): void;
  changeName(name: string, ownerMember: ISpaceMember): boolean;

  getLogo(): string;
  changeLogo(logo: string, ownerMember: ISpaceMember): boolean;
  setLogo(logo: string): void;

  getOwnerId(): T_UUID;
  changeOwner(
    oldOwnerMember: ISpaceMember,
    newOwnerMember: ISpaceMember,
  ): boolean;
  removeRole(requester: T_UUID, spaceRole: ISpaceRole): boolean;
  exportSpaceData(): z.infer<typeof spacePersistenceSchema>;
}
