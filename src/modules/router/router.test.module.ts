import { Module } from '@nestjs/common';
import { TestingCommonController } from '@src/modules/testing/controllers/testing.controller';
import { CoreModule } from '@src/modules/core.module';

@Module({ imports: [CoreModule], controllers: [TestingCommonController] })
export class RouterTestModule {}
