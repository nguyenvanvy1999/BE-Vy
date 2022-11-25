/* eslint-disable max-classes-per-file */
import { Global, Module } from '@nestjs/common';
import { GlobalConfigModule } from '@src/configs';
import { DebuggerModule } from '@src/modules/debugger/debugger.module';
import { TranslateModule } from '@src/modules/translate';
import { ErrorModule } from '@src/modules/utils/error/error.module';
import { MiddlewareModule } from '@src/modules/utils/middleware/middleware.module';
import { PaginationModule } from '@src/modules/utils/pagination/pagination.module';
import { RequestModule } from '@src/modules/utils/request/request.module';

import { HelperModule } from './utils/helper/helper.module';

@Global()
@Module({
  imports: [
    MiddlewareModule,
    ErrorModule,
    RequestModule,
    TranslateModule,
    PaginationModule,
    HelperModule,
    DebuggerModule,
  ],
})
export class CoreModule {}

@Module({
  controllers: [],
  providers: [],
  imports: [
    MiddlewareModule,
    ErrorModule,
    RequestModule,
    TranslateModule,
    PaginationModule,
    HelperModule,
    GlobalConfigModule,
  ],
})
export class UnitTestBaseModule {}

@Module({
  controllers: [],
  providers: [],
  imports: [UnitTestBaseModule],
})
export class E2ETestBaseModule {}
