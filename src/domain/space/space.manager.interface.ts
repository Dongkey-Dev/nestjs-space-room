import { T_UUID } from 'src/util/uuid';
import { ISpace } from './space.interface';

export interface ISpaceManager {
  createSpace(name: string, logo: string, ownerId: T_UUID): ISpace;
  getSpace(id: T_UUID): Promise<ISpace>;
  applySpace(space: ISpace): Promise<boolean>;
}
