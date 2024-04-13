import { IUUIDTransable, T_UUID } from 'src/util/uuid';
import { z } from 'zod';
import { ISpaceMember } from '../spaceMember/spaceMember.interface';
import { ISpaceRole } from '../spaceRole/spaceRole.interface';

export const spaceSchema = z.object({
  name: z.string(),
  logo: z.string().url(),
  ownerId: z.custom<IUUIDTransable>().transform((val) => new T_UUID(val)),
});

export interface ISpace {
  getId(): T_UUID;
  getName(): string;
  changeName(name: string, ownerMember: ISpaceMember): boolean;
  getLogo(): string;
  changeLogo(logo: string, ownerMember: ISpaceMember): boolean;

  getOwnerId(): T_UUID;
  changeOwner(
    oldOwnerMember: ISpaceMember,
    newOwnerMember: ISpaceMember,
  ): boolean;
  removeRole(requester: T_UUID, spaceRole: ISpaceRole): boolean;
}
