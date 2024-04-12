import { ISpaceMemberID } from './spaceMemberID.interface';

export class ISpaceMemberIDManager {
  protected sendToDatabase(toDomain: SpaceMember): Promise<boolean>;
  protected getFromDatabase(
    entityKey: any,
    condition?: any,
  ): Promise<SpaceMember>;
  protected getListFromDatabase(entityKey: any, condition?: any);
  createMemberID(space: ISpace): ISpaceMember;
  applyMemberID(member: ISpaceMemberID): boolean;
}
