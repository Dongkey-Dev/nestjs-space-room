import { Module } from '@nestjs/common';
import { SpaceRepository } from './space.repository';
import { SpaceManager } from './space.manager';

@Module({
  providers: [
    {
      provide: 'ISpaceManager',
      useClass: SpaceManager,
    },
    {
      provide: 'ISpaceRepository',
      useClass: SpaceRepository,
    },
  ],
  exports: ['ISpaceManager', 'ISpaceRepository'],
})
export class SpaceDomainModule {}
