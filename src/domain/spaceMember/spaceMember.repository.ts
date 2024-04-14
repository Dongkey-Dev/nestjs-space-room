import { Inject } from '@nestjs/common';
import { DataSource } from 'typeorm';
import { ISpaceMember } from './spaceMember.interface';
import { T_UUID } from 'src/util/uuid';
import { UserRoleEntity } from 'src/database/entities/userRole.entity';
import { SpaceMember } from './spaceMember';

export interface ISpaceMemberRepository {
  saveMember(member: ISpaceMember): Promise<boolean>;
  findMemberListByUser(user: T_UUID): Promise<ISpaceMember[]>;
  findMemberListBySpace(space: T_UUID): Promise<ISpaceMember[]>;
  findUserMember(user: T_UUID, space: T_UUID): Promise<ISpaceMember>;
  deleteMember(member: ISpaceMember): Promise<boolean>;
}

//UserRole
export class SpaceMemberRepository implements ISpaceMemberRepository {
  constructor(@Inject('DATA_SOURCE') private readonly dataSource: DataSource) {}

  async findUserMember(user: T_UUID, space: T_UUID): Promise<ISpaceMember> {
    return this.dataSource
      .getRepository(UserRoleEntity)
      .findOne({
        where: { userId: user.exportBuffer(), spaceId: space.exportBuffer() },
      })
      .then((member) => {
        return this.entityToDomain(member);
      });
  }

  async saveMember(member: ISpaceMember): Promise<boolean> {
    const memberEntity = this.dataSource
      .getRepository(UserRoleEntity)
      .create(member.exportSpaceMemberData());
    return await this.dataSource
      .getRepository(UserRoleEntity)
      .save(memberEntity)
      .then(() => {
        return true;
      })
      .catch(() => {
        return false;
      });
  }
  findMemberListByUser(user: T_UUID): Promise<ISpaceMember[]> {
    return this.dataSource
      .getRepository(UserRoleEntity)
      .find({ where: { userId: user.exportBuffer() } })
      .then((members) => {
        return members.map((member) => {
          return this.entityToDomain(member);
        });
      });
  }
  findMemberListBySpace(space: T_UUID): Promise<ISpaceMember[]> {
    return this.dataSource
      .getRepository(UserRoleEntity)
      .find({ where: { spaceId: space.exportBuffer() } })
      .then((members) => {
        return members.map((member) => {
          return this.entityToDomain(member);
        });
      });
  }
  deleteMember(member: ISpaceMember): Promise<boolean> {
    return this.dataSource
      .getRepository(UserRoleEntity)
      .softRemove({ id: member.getId().exportBuffer() })
      .then(() => {
        return true;
      })
      .catch(() => {
        return false;
      });
  }

  private entityToDomain(entity: UserRoleEntity): ISpaceMember {
    return new SpaceMember({
      id: entity.id,
      userId: entity.userId,
      spaceId: entity.spaceId,
      roleId: entity.roleId,
    });
  }
}
