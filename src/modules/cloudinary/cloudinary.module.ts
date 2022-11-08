import { Module } from '@nestjs/common';

import { CloudinaryProvider, CloudinaryService } from './services';

@Module({
  exports: [CloudinaryService, CloudinaryProvider],
  providers: [CloudinaryService, CloudinaryProvider],
})
export class CloudinaryModule {}
