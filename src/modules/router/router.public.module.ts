import { HttpModule } from '@nestjs/axios';
import { Module } from '@nestjs/common';
import { TerminusModule } from '@nestjs/terminus';
import { HealthController, HealthModule } from '@src/modules/health';
import { MessageModule } from '@src/modules/message';
import { MessagePublicController } from '@src/modules/message/controller/message.public.controller';
import { MetricsModule } from '@src/modules/metrics';
import { MetricsController } from '@src/modules/metrics/metrics.controller';
import { PrometheusModule } from '@src/modules/prometheus';
import { CoreModule } from '@src/modules/core.module';

@Module({
  imports: [HealthModule, PrometheusModule, MetricsModule, MessageModule, TerminusModule, HttpModule, CoreModule],
  controllers: [HealthController, MetricsController, MessagePublicController],
})
export class RouterPublicModule {}
