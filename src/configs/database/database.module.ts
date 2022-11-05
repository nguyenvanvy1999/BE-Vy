import { Module } from '@nestjs/common';
import { DatabaseService } from '@src/configs/database/services';

@Module({
  providers: [DatabaseService],
  exports: [DatabaseService],
})
export class DatabaseModule {}
