import type { MiddlewareConsumer, NestModule } from '@nestjs/common';
import { Module } from '@nestjs/common';

import {
  HtmlBodyParserMiddleware,
  JsonBodyParserMiddleware,
  RawBodyParserMiddleware,
  TextBodyParserMiddleware,
  UrlencodedBodyParserMiddleware,
} from './body-parser/body-parser.middleware';
import { CompressionMiddleware } from './compression/compression.middleware';
import { CorsMiddleware } from './cors/cors.middleware';
import { HelmetMiddleware } from './helmet/helmet.middleware';
import {
  HttpDebuggerMiddleware,
  HttpDebuggerResponseMiddleware,
} from './http-debugger/http-debugger.middleware';
import { RateLimitMiddleware } from './rate-limit/rate-limit.middleware';
import { TimestampMiddleware } from './timestamp/timestamp.middleware';
import { UserAgentMiddleware } from './user-agent/user-agent.middleware';

@Module({})
export class MiddlewareModule implements NestModule {
  configure(consumer: MiddlewareConsumer): void {
    consumer
      .apply(
        JsonBodyParserMiddleware,
        RawBodyParserMiddleware,
        HtmlBodyParserMiddleware,
        TextBodyParserMiddleware,
        UrlencodedBodyParserMiddleware,
        CompressionMiddleware,
        CorsMiddleware,
        HttpDebuggerResponseMiddleware,
        HttpDebuggerMiddleware,
        HelmetMiddleware,
        RateLimitMiddleware,
        TimestampMiddleware,
        UserAgentMiddleware,
      )
      .forRoutes('*');
  }
}
