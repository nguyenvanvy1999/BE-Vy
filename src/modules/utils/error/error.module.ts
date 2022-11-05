import { Module } from '@nestjs/common';
import { APP_FILTER } from '@nestjs/core';
import { MessageService } from '@src/modules/message/service';
import { ErrorHttpFilter } from '@src/modules/utils/error/error.filter';

@Module({
  controllers: [],
  providers: [
    {
      provide: APP_FILTER,
      inject: [MessageService],
      useFactory: (messageService: MessageService) => new ErrorHttpFilter(messageService),
    },
  ],
  imports: [],
})
export class ErrorModule {}
