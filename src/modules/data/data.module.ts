import { Module } from '@nestjs/common';
import { LicencePlateModule } from '../licence-plate/licence-plate.module';

import { DataCollectionModule } from './collections';
import { DataService } from './services/data.service';

@Module({
  imports: [DataCollectionModule, LicencePlateModule],
  providers: [DataService],
  exports: [DataService],
})
export class DataModule {}
