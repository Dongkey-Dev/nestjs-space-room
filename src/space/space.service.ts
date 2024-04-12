import { Injectable } from '@nestjs/common';
import { SpaceUsecase } from './space.usecase';
import { ISpace } from 'src/domain/space/space.interface';
import { ISpaceMemberID } from 'src/domain/spaceMemberID/spaceMemberID.interface';
import { T_UUID } from 'src/util/uuid';
@Injectable()
export class SpaceSerivce implements SpaceUsecase {
  constructor() {}
  create(
    ownerUuid: T_UUID,
    dto: z.infer<typeof createSpaceSchema>,
  ): Promise<ISpace> {
    throw new Error('Method not implemented.');
  }
  join(
    userUuid: T_UUID,
    inviteCode: string,
    roleName: string,
  ): Promise<ISpaceMemberID> {
    throw new Error('Method not implemented.');
  }
  find(userUuid: T_UUID, spaceUuid: T_UUID): Promise<ISpace[]> {
    throw new Error('Method not implemented.');
  }
  updateUserRole(targetUserUuid: T_UUID, roleId: T_UUID): Promise<void> {
    throw new Error('Method not implemented.');
  }
  addRole(
    spaceUuid: T_UUID,
    roleList: z.infer<typeof roleSchema>,
  ): Promise<void> {
    throw new Error('Method not implemented.');
  }
  removeRole(spaceUuid: T_UUID, roleId: T_UUID): Promise<void> {
    throw new Error('Method not implemented.');
  }
}
