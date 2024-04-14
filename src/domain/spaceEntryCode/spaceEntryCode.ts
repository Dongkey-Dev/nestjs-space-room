import { T_UUID } from 'src/util/uuid';
import { BaseDomain } from '../base/baseDomain';
import { z } from 'zod';
import {
  ISpaceEntryCode,
  spaceEntryCodeSchema,
} from './spaceEntryCode.interface';
import { ISpace } from '../space/space.interface';
import { ISpaceRole } from '../spaceRole/spaceRole.interface';
import { randomBytes } from 'crypto';

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
    if (!data.id) data.id = new T_UUID();
    if (!data.code) data.code = this.generateCode();
    this.import(data);
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
