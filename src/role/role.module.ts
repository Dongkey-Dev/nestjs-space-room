import { Module } from '@nestjs/common';
import { SpaceDomainModule } from 'src/domain/space/space.domain.module';
import { SpaceMemberDomainModule } from 'src/domain/spaceMember/space.domain.module';
import { RoleController } from './role.controller';
import { UserDomainModule } from 'src/domain/user/user.domain.module';
import { SpaceEntryCodeDomainModule } from 'src/domain/spaceEntryCode/spaceEntryCode.domain.module';
import { SpaceRoleDomainModule } from 'src/domain/spaceRole/spaceRole.domain.module';
import { RoleService } from './role.service';

@Module({
  imports: [
    UserDomainModule,
    SpaceDomainModule,
    SpaceMemberDomainModule,
    SpaceRoleDomainModule,
    SpaceEntryCodeDomainModule,
  ],
  controllers: [RoleController],
  providers: [
    {
      provide: 'RoleUsecase',
      useClass: RoleService,
    },
  ],
})
export class RoleModule {}
