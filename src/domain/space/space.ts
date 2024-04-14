import { T_UUID } from 'src/util/uuid';
import { BaseDomain } from '../base/baseDomain';
import { z } from 'zod';
import { ISpace, spacePersistenceSchema, spaceSchema } from './space.interface';
import { ISpaceMember } from '../spaceMember/spaceMember.interface';
import { ISpaceRole } from '../spaceRole/spaceRole.interface';
import { BadRequestException } from '@nestjs/common';

export class Space extends BaseDomain<typeof spaceSchema> implements ISpace {
  private id: T_UUID;
  private name: string;
  private logo: string;
  private ownerId: T_UUID;
  private createdAt?: Date;
  private updatedAt?: Date;

  constructor(data?: z.infer<typeof spaceSchema>) {
    super(spaceSchema);
    if (data) this.import(data);
    if (!this.id) this.id = new T_UUID();
  }
  setTobeRemove(requeser: T_UUID): void {
    if (!this.createdAt) throw new BadRequestException('Wrong space');
    if (this.ownerId.isEqual(requeser)) {
      this.changes.setToBeRemoved({ id: this.id });
    }
    throw new BadRequestException('Only owner can remove space');
  }
  setName(name: string): void {
    if (this.name) throw new BadRequestException('Name is already set');
    this.name = name;
  }
  setLogo(logo: string): void {
    if (this.logo) throw new BadRequestException('Logo is already set');
    this.logo = logo;
  }
  exportSpaceData(): z.infer<typeof spacePersistenceSchema> {
    return this.exportPersistence();
  }
  removeRole(requester: T_UUID, spaceRole: ISpaceRole): boolean {
    if (!this.ownerId) throw new BadRequestException('Wrong space');
    if (this.ownerId.isEqual(requester)) {
      spaceRole.setTobeRemove();
      return true;
    }
    throw new BadRequestException('Only owner can remove role');
  }

  getOwnerId(): T_UUID {
    return this.ownerId;
  }
  getId(): T_UUID {
    return this.id;
  }
  getName(): string {
    if (!this.name) throw new BadRequestException('Name is not set');
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
    throw new BadRequestException('Only owner can change space name');
  }
  getLogo(): string {
    if (!this.logo) throw new BadRequestException('Logo is not set');
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
    throw new BadRequestException('Only owner can change space logo');
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
    throw new BadRequestException('Only owner can change owner');
  }
}
