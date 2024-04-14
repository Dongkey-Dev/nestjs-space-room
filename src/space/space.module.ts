import { Module } from '@nestjs/common';
import { SpaceDomainModule } from 'src/domain/space/space.domain.module';
import { SpaceMemberDomainModule } from 'src/domain/spaceMember/space.domain.module';
import { SpaceController } from './space.controller';
import { SpaceService } from './space.service';
import { UserDomainModule } from 'src/domain/user/user.domain.module';
import { SpaceRoleDomainModule } from 'src/domain/spaceRole/spaceRole.domain.module';
import { SpaceEntryCodeDomainModule } from 'src/domain/spaceEntryCode/spaceEntryCode.domain.module';

@Module({
  imports: [
    UserDomainModule,
    SpaceDomainModule,
    SpaceMemberDomainModule,
    SpaceRoleDomainModule,
    SpaceEntryCodeDomainModule,
  ],
  controllers: [SpaceController],
  providers: [
    {
      provide: 'SpaceUsecase',
      useClass: SpaceService,
    },
  ],
})
export class SpaceModule {}
