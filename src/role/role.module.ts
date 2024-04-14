import { Module } from '@nestjs/common';
import { SpaceDomainModule } from 'src/domain/space/space.domain.module';
import { SpaceMemberDomainModule } from 'src/domain/spaceMember/space.domain.module';
import { SpaceController } from './role.controller';
import { SpaceSerivce } from './role.service';

@Module({
  imports: [SpaceDomainModule, SpaceMemberDomainModule],
  controllers: [SpaceController],
  providers: [
    {
      provide: 'SpaceUsecase',
      useClass: SpaceSerivce,
    },
  ],
})
export class SpaceModule {}
