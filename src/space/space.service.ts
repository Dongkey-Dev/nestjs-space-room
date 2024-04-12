import { Injectable } from '@nestjs/common';
import { SpaceUsecase } from './space.usecase';
import { ISpace } from 'src/domain/space/space.interface';
import { T_UUID } from 'src/util/uuid';
@Injectable()
export class SpaceSerivce implements SpaceUsecase {
  constructor() {}
  create(dto: {
    name?: string;
    logo?: string;
    ownerId?: T_UUID;
  }): Promise<ISpace> {
    throw new Error('Method not implemented.');
  }
}
