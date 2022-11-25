import { Module } from '@nestjs/common';
import { APP_FILTER } from '@nestjs/core';
import { TranslateService } from '@src/modules/translate/service';
import { ErrorHttpFilter } from '@src/modules/utils/error/error.filter';

@Module({
  controllers: [],
  providers: [
    {
      provide: APP_FILTER,
      inject: [TranslateService],
      useFactory: (messageService: TranslateService) =>
        new ErrorHttpFilter(messageService),
    },
  ],
  imports: [],
})
export class ErrorModule {}
