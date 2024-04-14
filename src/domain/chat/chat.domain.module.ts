import { Module } from '@nestjs/common';
import { ChatManager } from './chat.manager';
import { ChatRepository } from './chat.repository';

@Module({
  providers: [
    {
      provide: 'IChatManager',
      useClass: ChatManager,
    },
    {
      provide: 'IChatRepository',
      useClass: ChatRepository,
    },
  ],
  exports: ['IChatManager', 'IChatRepository'],
})
export class ChatDomainModule {}
