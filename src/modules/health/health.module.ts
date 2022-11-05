import { Module } from '@nestjs/common';
import { TerminusModule } from '@nestjs/terminus';
import { AwsHealthIndicator } from '@src/modules/health/indicators';
import { PrometheusModule } from '@src/modules/prometheus';

import { HealthService } from './health.service';
import { AWSModule } from '@src/modules/aws';

@Module({
  imports: [TerminusModule, PrometheusModule, AWSModule],
  providers: [HealthService, AwsHealthIndicator],
  exports: [HealthService, AwsHealthIndicator],
})
export class HealthModule {}
