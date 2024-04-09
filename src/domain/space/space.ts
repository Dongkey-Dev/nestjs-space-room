import { T_UUID } from 'src/util/uuid';
import { BaseDomain } from '../base/baseDomain';
import { z } from 'zod';
import { ISpace, spaceSchema } from './space.interface';
import { ISpaceMember } from '../spaceMember/spaceMember.interface';

export class Space
  extends BaseDomain<typeof spaceSchema>
  implements BaseDomain<typeof spaceSchema>, ISpace
{
  private id: T_UUID;
  private name: string;
  private logo: string;
  private ownerId: T_UUID;
  constructor(data: z.infer<typeof spaceSchema>) {
    super(spaceSchema);
    this.import(data);
    if (!this.id) this.id = new T_UUID();
  }
  getOwnerId(): T_UUID {
    return this.ownerId;
  }
  getId(): T_UUID {
    return this.id;
  }
  getName(): string {
    if (!this.name) throw new Error('Name is not set');
    return this.name;
  }
  changeName(name: string, ownerMember: ISpaceMember): boolean {
    if (
      ownerMember.getSpaceId() === this.getId() &&
      ownerMember.getUserId() === this.ownerId
    ) {
      this.name = name;
      return true;
    }
    throw new Error('Only owner can change space name');
  }
  getLogo(): string {
    if (!this.logo) throw new Error('Logo is not set');
    return this.logo;
  }
  changeLogo(logo: string, ownerMember: ISpaceMember): boolean {
    if (
      ownerMember.getSpaceId() === this.getId() &&
      ownerMember.getUserId() === this.ownerId
    ) {
      this.logo = logo;
      return true;
    }
    throw new Error('Only owner can change space logo');
  }

  changeOwner(
    oldOwnerMember: ISpaceMember,
    newOwnerMember: ISpaceMember,
  ): boolean {
    if (
      oldOwnerMember.getSpaceId() === this.getId() &&
      oldOwnerMember.getUserId() === this.ownerId
    ) {
      this.ownerId = newOwnerMember.getUserId();
      return true;
    }
    throw new Error('Only owner can change owner');
  }
}
