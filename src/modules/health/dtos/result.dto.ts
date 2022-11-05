import { ApiProperty } from '@nestjs/swagger';
import { HealthCheckStatus } from '@nestjs/terminus/dist/health-check/health-check-result.interface';
import { HealthIndicatorResult } from '@nestjs/terminus/dist/health-indicator';

export class HealthCheckResDTO {
  @ApiProperty()
  status: HealthCheckStatus;

  @ApiProperty()
  info?: HealthIndicatorResult;

  @ApiProperty()
  error?: HealthIndicatorResult;

  @ApiProperty()
  details: HealthIndicatorResult;
}
