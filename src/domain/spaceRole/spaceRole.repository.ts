import { Inject } from '@nestjs/common';
import { DataSource } from 'typeorm';
import { T_UUID } from 'src/util/uuid';
import { ISpaceRole } from './spaceRole.interface';
import { ISpace } from '../space/space.interface';
import { SpaceRole } from './spaceRole';
import { SpaceRoleEntity } from 'src/database/entities/spaceRole.entity';

export interface ISpaceRoleRepository {
  saveRole(role: ISpaceRole): Promise<boolean>;
  bulkSaveRole(roles: ISpaceRole[]): Promise<boolean>;
  findRolesBySpace(space: ISpace): Promise<ISpaceRole[]>;
  findRole(roleId: T_UUID): Promise<ISpaceRole>;
  deleteRole(role: ISpaceRole): Promise<boolean>;
}

//UserRole
export class SpaceRoleRepository implements ISpaceRoleRepository {
  constructor(@Inject('DATA_SOURCE') private readonly dataSource: DataSource) {}

  async findRole(roleId: T_UUID): Promise<ISpaceRole> {
    return this.dataSource
      .getRepository(SpaceRoleEntity)
      .findOne({
        where: { id: roleId.exportBuffer() },
      })
      .then((role) => {
        return this.entityToDomain(role);
      });
  }

  async saveRole(role: ISpaceRole): Promise<boolean> {
    const roleEntity = this.dataSource
      .getRepository(SpaceRoleEntity)
      .create(role.exportSpaceRoleData());
    return await this.dataSource
      .getRepository(SpaceRoleEntity)
      .save(roleEntity)
      .then(() => {
        return true;
      })
      .catch(() => {
        return false;
      });
  }

  async bulkSaveRole(roles: ISpaceRole[]): Promise<boolean> {
    const roleEntities = roles.map((role) => {
      return this.dataSource
        .getRepository(SpaceRoleEntity)
        .create(role.exportSpaceRoleData());
    });
    return await this.dataSource
      .getRepository(SpaceRoleEntity)
      .save(roleEntities)
      .then(() => {
        return true;
      })
      .catch(() => {
        return false;
      });
  }

  findRolesBySpace(space: ISpace): Promise<ISpaceRole[]> {
    return this.dataSource
      .getRepository(SpaceRoleEntity)
      .find({ where: { spaceId: space.getId().exportBuffer() } })
      .then((roles) => {
        return roles.map((role) => {
          return this.entityToDomain(role);
        });
      });
  }

  deleteRole(role: ISpaceRole): Promise<boolean> {
    return this.dataSource
      .getRepository(SpaceRoleEntity)
      .softRemove({ id: role.getId().exportBuffer() })
      .then(() => {
        return true;
      })
      .catch(() => {
        return false;
      });
  }

  private entityToDomain(entity: SpaceRoleEntity): ISpaceRole {
    if (!entity) return new SpaceRole();
    const role = new SpaceRole({
      id: new T_UUID(entity.id),
      spaceId: new T_UUID(entity.spaceId),
      roleName: entity.name,
      permission: entity.isAdmin ? 'admin' : 'member',
    });
    return role;
  }
}
