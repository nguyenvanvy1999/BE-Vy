import { Injectable } from '@nestjs/common';
import type { HealthIndicatorResult } from '@nestjs/terminus';
import { HealthCheckError, HealthIndicator } from '@nestjs/terminus';
import { S3Service } from '@src/modules/aws';

@Injectable()
export class AwsHealthIndicator extends HealthIndicator {
  constructor(private readonly awsS3Service: S3Service) {
    super();
  }

  public async isHealthy(key: string): Promise<HealthIndicatorResult> {
    try {
      await this.awsS3Service.listBucket();

      return this.getStatus(key, true);
    } catch {
      throw new HealthCheckError('ElasticsearchHealthIndicator failed', this.getStatus(key, false));
    }
  }
}
