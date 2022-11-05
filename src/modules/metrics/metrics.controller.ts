import { Controller, Get } from '@nestjs/common';
import { HttpApiError } from '@src/modules/utils/error/error.decorator';
import { HttpControllerInit } from '@src/modules/utils/init';
import { HttpApiRequest } from '@src/modules/utils/request/request.decorator';
import { HttpApiResponse } from '@src/modules/utils/response/response.decorator';

import { MetricsService } from './metrics.service';

@Controller('metrics')
@HttpControllerInit('Metric Public APIs', 'metric')
@HttpApiError()
export class MetricsController {
  constructor(private metricsService: MetricsService) {}

  @HttpApiRequest('Get metric')
  @HttpApiResponse('monitor.metric.get')
  @Get()
  public metrics(): Promise<string> {
    return this.metricsService.metrics;
  }
}
