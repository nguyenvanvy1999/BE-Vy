import { Global, Module } from '@nestjs/common';

import { CustomConfigService } from './services';

@Global()
@Module({
  providers: [CustomConfigService],
  exports: [CustomConfigService],
})
export class CustomConfigModule {}
