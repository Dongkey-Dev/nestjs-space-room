import { Module } from '@nestjs/common';
import { PostController } from './post.controller';
import { PostSerivce } from './post.service';
import { PostDomainModule } from 'src/domain/post/post.domain.module';
import { ChatDomainModule } from 'src/domain/chat/chat.domain.module';
import { UserDomainModule } from 'src/domain/user/user.domain.module';
import { SpaceDomainModule } from 'src/domain/space/space.domain.module';
import { SpaceMemberDomainModule } from 'src/domain/spaceMember/space.domain.module';
import { SpaceRoleDomainModule } from 'src/domain/spaceRole/spaceRole.domain.module';

@Module({
  imports: [
    UserDomainModule,
    SpaceDomainModule,
    SpaceMemberDomainModule,
    PostDomainModule,
    ChatDomainModule,
    SpaceRoleDomainModule,
  ],
  controllers: [PostController],
  providers: [
    {
      provide: 'PostUsecase',
      useClass: PostSerivce,
    },
  ],
})
export class PostModule {}
