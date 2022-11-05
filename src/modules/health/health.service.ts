import { Injectable, Logger } from '@nestjs/common';
import type { HealthCheckResult } from '@nestjs/terminus';
import { HealthCheck, HealthCheckService, HttpHealthIndicator } from '@nestjs/terminus';

import { PrometheusService } from '../prometheus/prometheus.service';
import type { IHealthIndicator } from './interfaces/health-indicator.interface';
import { NestjsHealthIndicator } from './models/nestjs-health.indicator';

@Injectable()
export class HealthService {
  private readonly listOfThingsToMonitor: IHealthIndicator[];

  constructor(
    private health: HealthCheckService,
    private http: HttpHealthIndicator,
    private promClientService: PrometheusService,
  ) {
    this.listOfThingsToMonitor = [
      new NestjsHealthIndicator(this.http, 'https://docs.nestjs.com', this.promClientService),
    ];
  }

  @HealthCheck()
  public check(): Promise<HealthCheckResult | undefined> {
    return this.health.check(
      this.listOfThingsToMonitor.map((apiIndicator: IHealthIndicator) => async () => {
        try {
          return await apiIndicator.isHealthy();
        } catch (error) {
          Logger.warn(error);

          return apiIndicator.reportUnhealthy();
        }
      }),
    );
  }
}
