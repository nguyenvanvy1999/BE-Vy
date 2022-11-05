import { Logger, Module } from '@nestjs/common';
import { HealthModule } from '@src/modules/health';
import { PrometheusModule } from '@src/modules/prometheus';

import { MetricsService } from './metrics.service';

@Module({
  providers: [MetricsService, Logger],
  imports: [PrometheusModule, HealthModule],
  exports: [MetricsService],
})
export class MetricsModule {}
