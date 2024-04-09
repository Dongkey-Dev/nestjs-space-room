import { T_UUID } from 'src/util/uuid';
import { ISpace } from './space.interface';

export interface ISpaceManager {
  createSpace(space: ISpace): boolean;
  getSpace(id: T_UUID): ISpace;
  applySpace(space: ISpace): boolean;
}
