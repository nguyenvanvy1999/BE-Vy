import { Get, InternalServerErrorException, ServiceUnavailableException } from '@nestjs/common';
import { InjectConnection } from '@nestjs/mongoose';
import type { HealthCheckResult } from '@nestjs/terminus';
import {
  DiskHealthIndicator,
  HealthCheck,
  HealthCheckService,
  MemoryHealthIndicator,
  MongooseHealthIndicator,
} from '@nestjs/terminus';
import { HealthCheckResDTO } from '@src/modules/health/dtos';
import { AwsHealthIndicator } from '@src/modules/health/indicators';
import { EStatusCodeError } from '@src/modules/utils/error/error.constant';
import { HttpApiError } from '@src/modules/utils/error/error.decorator';
import { HttpControllerInit } from '@src/modules/utils/init';
import { HttpApiRequest } from '@src/modules/utils/request/request.decorator';
import { HttpApiResponse } from '@src/modules/utils/response/response.decorator';
import type { IResponse } from '@src/modules/utils/response/response.interface';
import { Connection } from 'mongoose';

import { HealthService } from './health.service';

@HttpControllerInit('Health Public APIs', 'health')
@HttpApiError()
export class HealthController {
  constructor(
    @InjectConnection() private readonly databaseConnection: Connection,
    private healthService: HealthService,
    private readonly health: HealthCheckService,
    private readonly databaseIndicator: MongooseHealthIndicator,
    private readonly memoryHealthIndicator: MemoryHealthIndicator,
    private readonly diskHealthIndicator: DiskHealthIndicator,
    private readonly awsIndicator: AwsHealthIndicator,
  ) {}

  @HttpApiRequest('Health check')
  @HttpApiResponse('health.check', HealthCheckResDTO)
  @Get()
  public async check(): Promise<HealthCheckResult | undefined> {
    const healthCheckResult: HealthCheckResult | undefined = await this.healthService.check();

    for (const key in healthCheckResult?.info) {
      if (healthCheckResult?.info[key].status === 'down') {
        throw new ServiceUnavailableException(healthCheckResult);
      }
    }

    return healthCheckResult;
  }

  @HttpApiRequest('Health check AWS')
  @HttpApiResponse('health.check', HealthCheckResDTO)
  @HealthCheck()
  @Get('/aws')
  async checkAws(): Promise<IResponse> {
    try {
      return this.health.check([() => this.awsIndicator.isHealthy('aws bucket')]);
    } catch {
      throw new InternalServerErrorException({
        statusCode: EStatusCodeError.UNKNOWN_ERROR,
        message: 'http.serverError.internalServerError',
      });
    }
  }

  @HttpApiRequest('Health check database')
  @HttpApiResponse('health.check', HealthCheckResDTO)
  @HealthCheck()
  @Get('/database')
  async checkDatabase(): Promise<IResponse> {
    try {
      return this.health.check([
        () =>
          this.databaseIndicator.pingCheck('database', {
            connection: this.databaseConnection,
          }),
      ]);
    } catch {
      throw new InternalServerErrorException({
        statusCode: EStatusCodeError.UNKNOWN_ERROR,
        message: 'http.serverError.internalServerError',
      });
    }
  }

  @HttpApiRequest('Health check memory heap')
  @HttpApiResponse('health.check', HealthCheckResDTO)
  @HealthCheck()
  @Get('/memory-heap')
  async checkMemoryHeap(): Promise<IResponse> {
    try {
      return this.health.check([() => this.memoryHealthIndicator.checkHeap('memory heap', 300 * 1024 * 1024)]);
    } catch {
      throw new InternalServerErrorException({
        statusCode: EStatusCodeError.UNKNOWN_ERROR,
        message: 'http.serverError.internalServerError',
      });
    }
  }

  @HttpApiRequest('Health check memory rss')
  @HttpApiResponse('health.check', HealthCheckResDTO)
  @HealthCheck()
  @Get('/memory-rss')
  async checkMemoryRss(): Promise<IResponse> {
    try {
      return this.health.check([() => this.memoryHealthIndicator.checkRSS('memory RSS', 300 * 1024 * 1024)]);
    } catch {
      throw new InternalServerErrorException({
        statusCode: EStatusCodeError.UNKNOWN_ERROR,
        message: 'http.serverError.internalServerError',
      });
    }
  }

  @HttpApiRequest('Health check storage')
  @HttpApiResponse('health.check', HealthCheckResDTO)
  @HealthCheck()
  @Get('/storage')
  async checkStorage(): Promise<IResponse> {
    try {
      return this.health.check([
        () =>
          this.diskHealthIndicator.checkStorage('disk health', {
            thresholdPercent: 0.75,
            path: '/',
          }),
      ]);
    } catch {
      throw new InternalServerErrorException({
        statusCode: EStatusCodeError.UNKNOWN_ERROR,
        message: 'http.serverError.internalServerError',
      });
    }
  }
}
