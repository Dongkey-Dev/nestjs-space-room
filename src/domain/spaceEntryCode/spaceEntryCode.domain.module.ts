import { Module } from '@nestjs/common';
import { SpaceEntryCodeManager } from './spaceEntryCode.manager';

@Module({
  providers: [
    {
      provide: 'ISpaceEntryCodeManager',
      useClass: SpaceEntryCodeManager,
    },
    {
      provide: 'ISpaceEntryCodeRepository',
      useClass: SpaceEntryCodeManager,
    },
  ],
  exports: ['ISpaceEntryCodeManager', 'ISpaceEntryCodeRepository'],
})
export class SpaceEntryCodeDomainModule {}
