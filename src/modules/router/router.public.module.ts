import { HttpModule } from '@nestjs/axios';
import { Module } from '@nestjs/common';
import { HealthController, HealthModule } from '@src/modules/health';
import { TranslateModule } from '@src/modules/translate';
import { TranslatePublicController } from '@src/modules/translate/controller/translate.public.controller';
import { CoreModule } from '@src/modules/core.module';
import { TerminusModule } from '@nestjs/terminus';

@Module({
  imports: [
    HealthModule,
    TranslateModule,
    HttpModule,
    CoreModule,
    TerminusModule,
  ],
  controllers: [HealthController, TranslatePublicController],
})
export class RouterPublicModule {}
