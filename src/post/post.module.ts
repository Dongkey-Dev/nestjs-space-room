import { Module } from '@nestjs/common';
import { SpaceDomainModule } from 'src/domain/space/space.domain.module';
import { SpaceMemberDomainModule } from 'src/domain/spaceMember/space.domain.module';
import { SpaceController } from './post.controller';
import { SpaceSerivce } from './post.service';
import { PostDomainModule } from 'src/domain/post/post.domain.module';
import { ChatDomainModule } from 'src/domain/chat/chat.domain.module';

@Module({
  imports: [PostDomainModule, ChatDomainModule],
  controllers: [SpaceController],
  providers: [
    {
      provide: 'SpaceUsecase',
      useClass: SpaceSerivce,
    },
  ],
})
export class PostModule {}
