import { BadRequestException, Inject } from '@nestjs/common';
import { DataSource } from 'typeorm';
import { ISpaceEntryCode } from './spaceEntryCode.interface';
import { T_UUID } from 'src/util/uuid';
import { SpaceEntryCodeEntity } from 'src/database/entities/spaceEntryCode.entity';
import { SpaceEntryCode } from './spaceEntryCode';
import { randomBytes } from 'crypto';

const characters =
  'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
const charactersLength = characters.length;

export interface ISpaceEntryCodeRepository {
  save(code: ISpaceEntryCode): Promise<boolean>;
  delete(code: ISpaceEntryCode): Promise<boolean>;
  findBySpaceId(spaceId: T_UUID): Promise<ISpaceEntryCode[]>;
  findByCode(code: string): Promise<ISpaceEntryCode>;
  findEmptyCode(num?: number): Promise<ISpaceEntryCode>;
  findEmptyCodes(num: number): Promise<ISpaceEntryCode[]>;
}

export class SpaceEntryCodeRepository implements ISpaceEntryCodeRepository {
  constructor(@Inject('DATA_SOURCE') private readonly dataSource: DataSource) {}

  async findEmptyCodes(num: number): Promise<ISpaceEntryCode[]> {
    return await this.dataSource
      .getRepository(SpaceEntryCodeEntity)
      .find({ where: { spaceId: null }, take: num })
      .then((entities) => entities.map((entity) => this.entityToDomain(entity)))
      .then((codes) => {
        if (codes.length < num) {
          throw new BadRequestException('Not enough empty codes to generate.');
        }
        return codes;
      });
  }

  async findEmptyCode(): Promise<ISpaceEntryCode> {
    const entity = await this.createEntryCode();
    return this.generateEntityToDomain(entity);
  }

  private async createEntryCode(): Promise<SpaceEntryCodeEntity> {
    const entity = this.dataSource.getRepository(SpaceEntryCodeEntity).create({
      id: new T_UUID().exportBuffer(),
      code: this.generateCode(),
    });
    await this.dataSource.getRepository(SpaceEntryCodeEntity).save(entity);
    return entity;
  }

  private generateCode(): string {
    let code = '';
    for (let i = 0; i < 8; i++) {
      const randomIndex = randomBytes(1)[0] % charactersLength;
      code += characters.charAt(randomIndex);
    }
    return code;
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

  async findBySpaceId(spaceId: T_UUID): Promise<ISpaceEntryCode[]> {
    return await this.dataSource
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
    if (!entity) return new SpaceEntryCode();
    return new SpaceEntryCode({
      id: new T_UUID(entity.id),
      spaceId: new T_UUID(entity.spaceId),
      code: entity.code,
      roleId: new T_UUID(entity.roleId),
    });
  }

  private async generateEntityToDomain(
    entity: SpaceEntryCodeEntity,
  ): Promise<ISpaceEntryCode> {
    let isEntity;
    if (!entity) isEntity = await this.createEntryCode();
    isEntity = entity;
    return new SpaceEntryCode({
      id: isEntity.id ? new T_UUID(isEntity.id) : new T_UUID(),
      spaceId: new T_UUID(isEntity.spaceId),
      code: isEntity.code,
      roleId: new T_UUID(isEntity.roleId),
    });
  }
}
