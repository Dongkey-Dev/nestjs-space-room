import { Module } from '@nestjs/common';
import { PostManager } from './post.manager';
import { PostRepository } from './post.repository';

@Module({
  providers: [
    {
      provide: 'IPostManager',
      useClass: PostManager,
    },
    {
      provide: 'IPostRepository',
      useClass: PostRepository,
    },
  ],
  exports: ['IPostManager', 'IPostRepository'],
})
export class PostDomainModule {}
