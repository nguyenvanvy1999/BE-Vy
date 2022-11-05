import { Module } from '@nestjs/common';

import { S3Service, WSService } from './services';
import { ConfigService } from '@nestjs/config';

@Module({
  imports: [],
  providers: [S3Service, WSService, ConfigService],
  exports: [S3Service, WSService],
})
export class AWSModule {}
