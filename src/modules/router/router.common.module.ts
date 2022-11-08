import { Module } from '@nestjs/common';

import { CloudinaryModule } from '../cloudinary/cloudinary.module';
import { DataController } from '../data/controllers';
import { DataModule } from '../data/data.module';

@Module({ imports: [DataModule, CloudinaryModule], controllers: [DataController] })
export class RouterCommonModule {}
