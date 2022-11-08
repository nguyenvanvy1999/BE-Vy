import { Module } from '@nestjs/common';

import { DataCollectionModule } from './collections';
import { DataService } from './services/data.service';

@Module({
  imports: [DataCollectionModule],
  providers: [DataService],
  exports: [DataService],
})
export class DataModule {}
