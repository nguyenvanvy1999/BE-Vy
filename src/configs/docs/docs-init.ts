import type { INestApplication } from '@nestjs/common';
import { SwaggerModule } from '@nestjs/swagger';
import type { IDocsConfig } from '@src/configs/env/config';
import fs from 'fs';
import { AsyncApiModule } from 'nestjs-asyncapi';
import { RedocModule } from 'nestjs-redoc';

import { asyncApiConfig, buildRedocOptions, buildSwaggerConfig } from './docs-config';
import { EDocsType } from '@src/configs/docs/docs.interface';
import { RouterCommonModule } from '@src/modules/router/router.common.module';
import { RouterPublicModule } from '@src/modules/router/router.public.module';
import { RouterTestModule } from '@src/modules/router/router.test.module';
import { RouterAdminModule } from '@src/modules/router/router.admin.module';
import { AppModule } from '@src/modules/app/app.module';
import { RouterWebhookModule } from '@src/modules/router/router.webhook.module';
import { RouterDeviceModule } from '@src/modules/router/router.device.module';

export async function initDocs(app: INestApplication, docs: IDocsConfig): Promise<void> {
  const commonDocument = SwaggerModule.createDocument(app, buildSwaggerConfig(EDocsType.COMMON), {
    include: [RouterCommonModule],
  });
  const adminDocument = SwaggerModule.createDocument(app, buildSwaggerConfig(EDocsType.ADMIN), {
    include: [RouterAdminModule],
  });
  const publicDocument = SwaggerModule.createDocument(app, buildSwaggerConfig(EDocsType.PUBLIC), {
    include: [RouterPublicModule, RouterTestModule, AppModule],
  });
  const deviceDocument = SwaggerModule.createDocument(app, buildSwaggerConfig(EDocsType.DEVICE), {
    include: [RouterDeviceModule],
  });
  const webhookDocument = SwaggerModule.createDocument(app, buildSwaggerConfig(EDocsType.WEBHOOK), {
    include: [RouterWebhookModule],
  });

  const asyncApiDocument = AsyncApiModule.createDocument(app, asyncApiConfig);

  if (docs.swagger.enable) {
    SwaggerModule.setup('swagger/public', app, publicDocument);
    SwaggerModule.setup('swagger/admin', app, adminDocument);
    SwaggerModule.setup('swagger/device', app, deviceDocument);
    SwaggerModule.setup('swagger/common', app, commonDocument);
    SwaggerModule.setup('swagger/webhook', app, webhookDocument);
  }

  let promise0, promise1, promise2, promise3, promise4, promise5;

  if (docs.redoc.enable) {
    const redocCommonOptions = buildRedocOptions(
      EDocsType.COMMON,
      docs.redoc.auth.enable,
      docs.redoc.auth.username,
      docs.redoc.auth.password,
    );
    const redocAdminOptions = buildRedocOptions(
      EDocsType.ADMIN,
      docs.redoc.auth.enable,
      docs.redoc.auth.username,
      docs.redoc.auth.password,
    );
    const redocPublicOptions = buildRedocOptions(
      EDocsType.PUBLIC,
      docs.redoc.auth.enable,
      docs.redoc.auth.username,
      docs.redoc.auth.password,
    );
    const redocDeviceOptions = buildRedocOptions(
      EDocsType.DEVICE,
      docs.redoc.auth.enable,
      docs.redoc.auth.username,
      docs.redoc.auth.password,
    );
    const redocWebhookOptions = buildRedocOptions(
      EDocsType.WEBHOOK,
      docs.redoc.auth.enable,
      docs.redoc.auth.username,
      docs.redoc.auth.password,
    );
    promise0 = RedocModule.setup('/redoc/public', app, publicDocument, redocPublicOptions);
    promise1 = RedocModule.setup('/redoc/admin', app, adminDocument, redocAdminOptions);
    promise2 = RedocModule.setup('/redoc/device', app, deviceDocument, redocDeviceOptions);
    promise3 = RedocModule.setup('/redoc/common', app, commonDocument, redocCommonOptions);
    promise4 = RedocModule.setup('/redoc/webhook', app, commonDocument, redocWebhookOptions);
  }

  if (docs.asyncApi.enable) {
    promise5 = AsyncApiModule.setup('/async-api', app, asyncApiDocument);
  }

  await Promise.all([promise0, promise1, promise2, promise3, promise4, promise5]);

  if (docs.swagger.write) {
    const pr0 = fs.promises.writeFile('./docs/socket-io.json', JSON.stringify(asyncApiDocument));
    const pr1 = fs.promises.writeFile('./docs/swagger-public.json', JSON.stringify(publicDocument));
    const pr2 = fs.promises.writeFile('./docs/swagger-admin.json', JSON.stringify(adminDocument));
    const pr3 = fs.promises.writeFile('./docs/swagger-device.json', JSON.stringify(deviceDocument));
    const pr4 = fs.promises.writeFile('./docs/swagger-common.json', JSON.stringify(commonDocument));
    const pr5 = fs.promises.writeFile('./docs/swagger-common.json', JSON.stringify(commonDocument));
    await Promise.all([pr0, pr1, pr2, pr3, pr4, pr5]);
  }
}
