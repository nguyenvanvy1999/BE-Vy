import { Injectable, Logger } from '@nestjs/common';

import { HealthService } from '../health/health.service';
import { PrometheusService } from '../prometheus/prometheus.service';

@Injectable()
export class MetricsService {
  public get metrics(): Promise<string> {
    return this.healthService
      .check()
      .then(() => this.promClientService.metrics)
      .catch((error) => {
        this.logger.error(error);

        return '';
      });
  }

  constructor(
    private promClientService: PrometheusService,
    private healthService: HealthService,
    private readonly logger: Logger,
  ) {}
}
