import { Module } from '@nestjs/common';
import { SpaceMemberRepository } from './spaceMember.repository';
import { SpaceMemberManager } from './spaceMember.manager';

@Module({
  providers: [
    {
      provide: 'ISpaceMemberManager',
      useClass: SpaceMemberManager,
    },
    {
      provide: 'ISpaceMemberRepository',
      useClass: SpaceMemberRepository,
    },
  ],
  exports: ['ISpaceMemberManager', 'ISpaceMemberRepository'],
})
export class SpaceDomainModule {}
