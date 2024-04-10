import { T_UUID } from 'src/util/uuid';
import { BaseDomain } from '../base/baseDomain';
import { BadRequestException, Inject } from '@nestjs/common';
import { DataSource } from 'typeorm';
import { z } from 'zod';
import { UserEntity } from 'src/database/entities/user.entity';
import { IUser, registUserSchema, userSchema } from './user.interface';
import { User } from './user';

export interface IUserRepository {
  getUserForLogin(email: string): Promise<IUser>;
  registUser(userData: z.infer<typeof registUserSchema>): Promise<boolean>;
  saveUser(user: IUser & BaseDomain<typeof userSchema>): Promise<boolean>;
  getUser(id: T_UUID): Promise<IUser>;
  softRemoveUser(id: T_UUID): Promise<boolean>;
}

export class UserRepository implements IUserRepository {
  constructor(@Inject('DATA_SOURCE') private readonly dataSource: DataSource) {}
  async getUserForLogin(email: string): Promise<IUser> {
    const userEntity = await this.dataSource
      .getRepository(UserEntity)
      .createQueryBuilder('user')
      .addSelect('user.password')
      .where('user.email = :email', { email })
      .getOne();
    if (!userEntity) return new User();
    const user = new User(userEntity);
    user.keepPassword(userEntity.password);
    return user;
  }
  async registUser(
    userData: z.infer<typeof registUserSchema>,
  ): Promise<boolean> {
    const userEntity = this.dataSource
      .getRepository(UserEntity)
      .create({ ...userData, createdAt: new Date(), updatedAt: new Date() });
    return this.dataSource
      .getRepository(UserEntity)
      .save(userEntity)
      .then(() => {
        return true;
      })
      .catch(() => {
        return false;
      });
  }

  async saveUser(
    user: IUser & BaseDomain<typeof userSchema>,
  ): Promise<boolean> {
    const userData = { ...user.exportPersistence() };
    const password = user.popPassword();
    if (password) userData.password = password;
    const userEntity = this.dataSource.getRepository(UserEntity).create({
      ...userData,
    });
    return this.dataSource
      .getRepository(UserEntity)
      .save(userEntity)
      .then(() => {
        return true;
      })
      .catch((e) => {
        if (e.code === 'ER_DUP_ENTRY')
          throw new BadRequestException('Email already exists');
        return false;
      });
  }

  async getUser(id: T_UUID): Promise<IUser> {
    const userEntity = await this.dataSource.getRepository(UserEntity).findOne({
      where: { id: id.exportBuffer() },
    });
    if (!userEntity) return new User();
    return new User(userEntity);
  }

  async softRemoveUser(id: T_UUID): Promise<boolean> {
    return true;
  }
}
