import { IUUIDTransable, T_UUID } from 'src/util/uuid';
import { ISpaceEntryCode } from './spaceEntryCode.interface';
import { z } from 'zod';
import { ISpace } from '../space/space.interface';

export const createCodeSchema = z.object({
  spaceId: z.custom<IUUIDTransable>().transform((val) => new T_UUID(val)),
  roleId: z.custom<IUUIDTransable>().transform((val) => new T_UUID(val)),
});

export interface ISpaceEntryCodeManager {
  createEntryCode(): Promise<ISpaceEntryCode>;
  createEntryCodes(num: number): Promise<ISpaceEntryCode[]>;
  getEntryCodesBySpace(space: ISpace): Promise<ISpaceEntryCode[]>;
  getEntryCodeByCode(code: string): Promise<ISpaceEntryCode>;
}
