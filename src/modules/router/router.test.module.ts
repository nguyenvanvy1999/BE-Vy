import { Module } from '@nestjs/common';
import { CoreModule } from '@src/modules/core.module';
import { TestingCommonController } from '@src/modules/testing/controllers/testing.controller';

@Module({ imports: [CoreModule], controllers: [TestingCommonController] })
export class RouterTestModule {}
