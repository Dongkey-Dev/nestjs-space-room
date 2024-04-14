import { Inject } from '@nestjs/common';
import { DataSource } from 'typeorm';
import { ISpaceEntryCode } from './spaceEntryCode.interface';
import { T_UUID } from 'src/util/uuid';
import { SpaceEntryCodeEntity } from 'src/database/entities/spaceEntryCode.entity';
import { SpaceEntryCode } from './spaceEntryCode';

export interface ISpaceEntryCodeRepository {
  save(code: ISpaceEntryCode): Promise<boolean>;
  delete(code: ISpaceEntryCode): Promise<boolean>;
  findBySpaceId(spaceId: T_UUID): Promise<ISpaceEntryCode[]>;
  findByCode(code: string): Promise<ISpaceEntryCode>;
  findEmptyCode(num?: number): Promise<ISpaceEntryCode>;
  findEmptyCodes(num: number): Promise<ISpaceEntryCode[]>;
}

export class SpaceRoleRepository implements ISpaceEntryCodeRepository {
  constructor(@Inject('DATA_SOURCE') private readonly dataSource: DataSource) {}

  async findEmptyCodes(num: number): Promise<ISpaceEntryCode[]> {
    return this.dataSource
      .getRepository(SpaceEntryCodeEntity)
      .find({ where: { spaceId: null }, take: num })
      .then((entities) => entities.map((entity) => this.entityToDomain(entity)))
      .then((codes) => {
        if (codes.length < num) {
          throw new Error('Not enough empty codes to generate.');
        }
        return codes;
      });
  }

  async findEmptyCode(): Promise<ISpaceEntryCode> {
    return this.dataSource
      .getRepository(SpaceEntryCodeEntity)
      .findOne({ where: { spaceId: null } })
      .then((entity) => this.entityToDomain(entity))
      .then((code) => {
        if (!code) {
          throw new Error('Not enough empty codes to generate.');
        }
        return code;
      });
  }

  async save(code: ISpaceEntryCode): Promise<boolean> {
    const codeEntity = this.dataSource
      .getRepository(SpaceEntryCodeEntity)
      .create(code.exportPersistenceData());
    return await this.dataSource
      .getRepository(SpaceEntryCodeEntity)
      .save(codeEntity)
      .then(() => true)
      .catch(() => false);
  }

  async delete(code: ISpaceEntryCode): Promise<boolean> {
    return await this.dataSource
      .getRepository(SpaceEntryCodeEntity)
      .softRemove({ id: code.getId().exportBuffer() })
      .then(() => true)
      .catch(() => false);
  }

  findBySpaceId(spaceId: T_UUID): Promise<ISpaceEntryCode[]> {
    return this.dataSource
      .getRepository(SpaceEntryCodeEntity)
      .find({ where: { spaceId: spaceId.exportBuffer() } })
      .then((entities) =>
        entities.map((entity) => this.entityToDomain(entity)),
      );
  }

  findByCode(code: string): Promise<ISpaceEntryCode> {
    return this.dataSource
      .getRepository(SpaceEntryCodeEntity)
      .findOne({ where: { code } })
      .then((entity) => this.entityToDomain(entity));
  }

  private entityToDomain(entity: SpaceEntryCodeEntity): ISpaceEntryCode {
    return new SpaceEntryCode({
      id: new T_UUID(entity.id),
      spaceId: new T_UUID(entity.spaceId),
      code: entity.code,
      roleId: new T_UUID(entity.roleId),
    });
  }
}
