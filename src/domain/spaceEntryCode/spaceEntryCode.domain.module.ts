import { Module } from '@nestjs/common';
import { SpaceEntryCodeManager } from './spaceEntryCode.manager';
import { SpaceEntryCodeRepository } from './spaceEntryCode.repository';

@Module({
  providers: [
    {
      provide: 'ISpaceEntryCodeManager',
      useClass: SpaceEntryCodeManager,
    },
    {
      provide: 'ISpaceEntryCodeRepository',
      useClass: SpaceEntryCodeRepository,
    },
  ],
  exports: ['ISpaceEntryCodeManager', 'ISpaceEntryCodeRepository'],
})
export class SpaceEntryCodeDomainModule {}
