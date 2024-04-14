import { BadRequestException, Inject, Injectable } from '@nestjs/common';
import { DomainManager } from '../base/domainManager';
import { IUserManager } from './user.manager.interface';
import { IUserRepository } from './user.repository';
import { User } from './user';
import { IUser } from './user.interface';

@Injectable()
export class UserManager extends DomainManager<User> implements IUserManager {
  constructor(
    @Inject('IUserRepository')
    private readonly userRepository: IUserRepository,
  ) {
    super(User);
  }
  async getUserForLogin(email: string): Promise<User> {
    return this.userRepository.getUserForLogin(email).then((user) => {
      return user as User;
    });
  }
  async registUser(user: User, password: string): Promise<User> {
    const userData = user.exportPersistence();
    userData.password = password;
    await this.sendToDatabase(user);
    return user;
  }
  protected async sendToDatabase(toDomain: User): Promise<boolean> {
    const result = await this.userRepository.saveUser(toDomain);
    if (!result) throw new BadRequestException('Failed to save user');
    return true;
  }
  protected getFromDatabase(entityKey: any, condition?: any): Promise<User> {
    return this.userRepository.getUser(entityKey) as Promise<User>;
  }
  protected getListFromDatabase(
    entityKey: any,
    condition?: any,
  ): Promise<IUser[]> {
    throw new BadRequestException('Method not implemented.');
  }
}
