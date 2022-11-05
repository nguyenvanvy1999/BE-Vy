import type { DynamicModule } from '@nestjs/common';
import { Module } from '@nestjs/common';
import { RouterModule } from '@nestjs/core';
import { RouterAdminModule } from '@src/modules/router/router.admin.module';
import { RouterCommonModule } from '@src/modules/router/router.common.module';
import { RouterPublicModule } from '@src/modules/router/router.public.module';
import { RouterTestModule } from '@src/modules/router/router.test.module';
import { RouterWebhookModule } from '@src/modules/router/router.webhook.module';
import { RouterDeviceModule } from '@src/modules/router/router.device.module';

@Module({})
export class AppRouterModule {
  static register(): DynamicModule {
    if (process.env.APP_HTTP_ON === 'true') {
      return {
        module: AppRouterModule,
        controllers: [],
        providers: [],
        exports: [],
        imports: [
          RouterCommonModule,
          RouterTestModule,
          RouterPublicModule,
          RouterAdminModule,
          RouterWebhookModule,
          RouterDeviceModule,
          RouterModule.register([
            {
              path: '/',
              module: RouterCommonModule,
            },
            {
              path: '/device',
              module: RouterDeviceModule,
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
        ],
      };
    }

    return {
      module: AppRouterModule,
      providers: [],
      exports: [],
      controllers: [],
      imports: [],
    };
  }
}
