import { Module } from '@nestjs/common';
import { UserManager } from './user.manager';
import { UserRepository } from './user.repository';

@Module({
  providers: [
    {
      provide: 'IUserManager',
      useClass: UserManager,
    },
    {
      provide: 'IUserRepository',
      useClass: UserRepository,
    },
  ],
  exports: ['IUserManager', 'IUserRepository'],
})
export class UserDomainModule {}
