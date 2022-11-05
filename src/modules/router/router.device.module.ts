import { Module } from '@nestjs/common';
import { CoreModule } from '@src/modules/core.module';

@Module({ imports: [CoreModule], controllers: [] })
export class RouterDeviceModule {}
