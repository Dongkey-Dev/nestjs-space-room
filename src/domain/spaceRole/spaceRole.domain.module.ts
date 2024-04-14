import { Module } from '@nestjs/common';
import { SpaceRoleManager } from './spaceRole.manager';
import { SpaceRoleRepository } from './spaceRole.repository';

@Module({
  providers: [
    {
      provide: 'ISpaceRoleManager',
      useClass: SpaceRoleManager,
    },
    {
      provide: 'ISpaceRoleRepository',
      useClass: SpaceRoleRepository,
    },
  ],
  exports: ['ISpaceRoleManager', 'ISpaceRoleRepository'],
})
export class SpaceRoleDomainModule {}
