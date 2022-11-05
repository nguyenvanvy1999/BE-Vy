import { Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { ApiGatewayManagementApi, DynamoDB, S3 } from 'aws-sdk';
import { AwsSdkModule } from 'nest-aws-sdk';

import { CustomConfigModule } from '../env';

@Module({
  imports: [
    AwsSdkModule.forRootAsync({
      defaultServiceOptions: {
        useFactory: (config: ConfigService) => ({
          region: config.get<string>('aws.s3.bucket'),
          credentials: {
            accessKeyId: config.get<string>('aws.credential.key'),
            secretAccessKey: config.get<string>('aws.credential.secret'),
            sessionToken: config.get<string>('aws.credential.token '),
          },
        }),
        imports: [CustomConfigModule],
        inject: [ConfigService],
      },
      services: [S3, DynamoDB, ApiGatewayManagementApi],
    }),
  ],
})
export class AWSConfigModule {}
