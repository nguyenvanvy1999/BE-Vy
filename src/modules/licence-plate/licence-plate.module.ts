import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ECollectionName } from '../utils/database';
import { LicencePlateSchema } from './licence-plate.schema';
import { LicencePlateService } from './licence-plate.service';

@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: ECollectionName.LICENCE_PLATES,
        schema: LicencePlateSchema,
        collection: ECollectionName.LICENCE_PLATES,
      },
    ]),
  ],
  providers: [LicencePlateService],
  exports: [LicencePlateService],
})
export class LicencePlateModule {}
