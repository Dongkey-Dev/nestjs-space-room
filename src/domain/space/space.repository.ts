import { T_UUID } from 'src/util/uuid';
import { Inject } from '@nestjs/common';
import { DataSource } from 'typeorm';
import { ISpace } from './space.interface';
import { SpaceEntity } from 'src/database/entities/space.entity';
import { UserRoleEntity } from 'src/database/entities/userRole.entity';
import { Space } from './space';

export interface ISpaceRepository {
  findSpace(id: T_UUID): Promise<ISpace>;
  deleteSpace(id: T_UUID): Promise<boolean>;
  saveSpace(spaceData: ISpace): Promise<boolean>;
}

export class SpaceRepository implements ISpaceRepository {
  constructor(@Inject('DATA_SOURCE') private readonly dataSource: DataSource) {}
  findSpace(id: T_UUID): Promise<ISpace> {
    return this.dataSource
      .getRepository(SpaceEntity)
      .findOne({
        where: { id: id.exportBuffer() },
      })
      .then((spaceEntity) => {
        if (!spaceEntity) return new Space();
        return this.entityToDomain(spaceEntity);
      });
  }
  async deleteSpace(id: T_UUID): Promise<boolean> {
    const spaceEntity = await this.dataSource
      .getRepository(SpaceEntity)
      .findOne({
        where: { id: id.exportBuffer() },
        relations: ['UserRoles'],
      });
    if (!spaceEntity) throw new Error('Space not found');

    await this.dataSource
      .getRepository(UserRoleEntity)
      .softRemove({ spaceId: id.exportBuffer() });

    //TODO: spaceRole에 대해서도 softRemove 필요
    return true;
  }

  async saveSpace(space: ISpace): Promise<boolean> {
    const newSpaceEntity = this.dataSource.getRepository(SpaceEntity).create({
      ...space.exportSpaceData(),
    });
    return await this.dataSource
      .getRepository(SpaceEntity)
      .save(newSpaceEntity)
      .then(() => {
        return true;
      })
      .catch(() => {
        return false;
      });
  }

  private entityToDomain(entity: SpaceEntity): ISpace {
    return new Space({
      id: new T_UUID(entity.id),
      name: entity.name,
      logo: entity.logo,
      ownerId: new T_UUID(entity.ownerId),
      createdAt: entity.createdAt,
      updatedAt: entity.updatedAt,
    });
  }
}
