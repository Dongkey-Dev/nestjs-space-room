import { DomainManager } from '../base/domainManager';
import { SpaceMember } from './spaceMember';
import { ISpaceMemberManager } from './spaceMember.manager.interface';
import { ISpaceMember } from './spaceMember.interface';
import { ISpace } from '../space/space.interface';
import { IUser } from '../user/user.interface';
import { BadRequestException, Inject } from '@nestjs/common';
import { ISpaceMemberRepository } from './spaceMember.repository';
import { T_UUID } from 'src/util/uuid';

export class SpaceMemberManager
  extends DomainManager<SpaceMember>
  implements ISpaceMemberManager
{
  constructor(
    @Inject('ISpaceMemberRepository')
    private readonly spaceMemberRepository: ISpaceMemberRepository,
  ) {
    super(SpaceMember);
  }
  getMemberByUserAndSpace(user: IUser, spaceId: T_UUID): Promise<ISpaceMember> {
    return this.spaceMemberRepository.findUserMember(user.getId(), spaceId);
  }

  getMembersBySpace(space: ISpace): Promise<ISpaceMember[]> {
    return this.spaceMemberRepository.findMemberListBySpace(space.getId());
  }
  getMembersByUser(user: IUser): Promise<ISpaceMember[]> {
    return this.spaceMemberRepository.findMemberListByUser(user.getId());
  }
  protected async sendToDatabase(toDomain: SpaceMember): Promise<boolean> {
    const result = await this.spaceMemberRepository.saveMember(toDomain);
    if (!result) throw new BadRequestException('Failed to save space member');
    return true;
  }
  protected getFromDatabase(
    entityKey: any,
    condition?: any,
  ): Promise<SpaceMember> {
    throw new BadRequestException('Method not implemented.');
  }
  async applyMember(member: ISpaceMember): Promise<boolean> {
    return await this.sendToDatabase(member as SpaceMember);
  }
  createMember(): ISpaceMember {
    return new SpaceMember();
  }
}
