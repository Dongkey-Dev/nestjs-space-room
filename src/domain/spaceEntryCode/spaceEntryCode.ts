import { T_UUID } from 'src/util/uuid';
import { BaseDomain } from '../base/baseDomain';
import { z } from 'zod';
import {
  ISpaceEntryCode,
  exportSpaceEntryCodeSchema,
  spaceEntryCodePersistenceSchema,
  spaceEntryCodeSchema,
} from './spaceEntryCode.interface';
import { ISpace } from '../space/space.interface';
import { ISpaceRole } from '../spaceRole/spaceRole.interface';
import { randomBytes } from 'crypto';
import { DomainChange } from '../base/domainChange';
import { BadRequestException } from '@nestjs/common';

const characters =
  'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
const charactersLength = characters.length;

export class SpaceEntryCode
  extends BaseDomain<typeof spaceEntryCodeSchema>
  implements ISpaceEntryCode
{
  private id: T_UUID;
  private spaceId: T_UUID;
  private roleId: T_UUID;
  private code: string;

  constructor(data?: z.infer<typeof spaceEntryCodeSchema>) {
    super(spaceEntryCodeSchema);
    if (data) this.import(data);
    if (!this.id) this.id = new T_UUID();
    this.changes = new DomainChange();
  }
  exportCode(role: ISpaceRole): z.output<typeof exportSpaceEntryCodeSchema> {
    if (!this.roleId.isEqual(role.getId()))
      throw new BadRequestException('Role is not matched');
    return exportSpaceEntryCodeSchema.parse({
      code: this.code,
      roleName: role.getName(),
      permission: role.getPermission(),
    });
  }
  isTobeRemove(): boolean {
    if (this.changes.exportToBeRemoved()) return true;
    return false;
  }
  exportPersistenceData(): z.output<typeof spaceEntryCodePersistenceSchema> {
    return spaceEntryCodePersistenceSchema.parse(this.exportPersistence());
  }
  getId(): T_UUID {
    return this.id;
  }
  getSpaceId(): T_UUID {
    return this.spaceId;
  }
  setSpaceId(space: ISpace): void {
    this.spaceId = space.getId();
  }
  getCode(): string {
    return this.code;
  }
  getRoleId(): T_UUID {
    return this.roleId;
  }
  setRoleId(role: ISpaceRole): void {
    this.roleId = role.getId();
  }
  generateCode(): string {
    let code = '';
    for (let i = 0; i < 8; i++) {
      const randomIndex = randomBytes(1)[0] % charactersLength;
      code += characters.charAt(randomIndex);
    }
    return code;
  }
}
