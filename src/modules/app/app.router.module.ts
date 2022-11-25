import type { DynamicModule } from '@nestjs/common';
import { Module } from '@nestjs/common';
import { RouterModule } from '@nestjs/core';
import { RouterAdminModule } from '@src/modules/router/router.admin.module';
import { RouterCommonModule } from '@src/modules/router/router.common.module';
import { RouterPublicModule } from '@src/modules/router/router.public.module';
import { RouterTestModule } from '@src/modules/router/router.test.module';
import { RouterWebhookModule } from '@src/modules/router/router.webhook.module';
import { GatewayModules } from '../gateway/gateway.module';

@Module({})
export class AppRouterModule {
  static register(): DynamicModule {
    const imports = [];
    if (process.env.APP_HTTP_ON === 'true') {
      imports.push(
        RouterCommonModule,
        RouterTestModule,
        RouterPublicModule,
        RouterAdminModule,
        RouterWebhookModule,
        RouterModule.register([
          {
            path: '/',
            module: RouterCommonModule,
          },
          {
            path: '/test',
            module: RouterTestModule,
          },
          {
            path: '/admin',
            module: RouterAdminModule,
          },
          {
            path: '/public',
            module: RouterPublicModule,
          },
          {
            path: '/webhook',
            module: RouterWebhookModule,
          },
        ]),
      );
    }

    if (process.env.APP_WEBSOCKET_ON === 'true') {
      imports.push(GatewayModules);
    }

    return {
      module: AppRouterModule,
      providers: [],
      exports: [],
      controllers: [],
      imports,
    };
  }
}
