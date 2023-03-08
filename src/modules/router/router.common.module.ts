import { Logger, Module } from '@nestjs/common';
import { UserModule } from '@src/modules/user/user.module';
import {
  AdminUserController,
  UserController,
} from '@src/modules/user/controllers';
import { CoreModule } from '@src/modules/core.module';
import { HttpModule } from '@nestjs/axios';
import { DataController } from '../data/controllers';
import { DataModule } from '../data/data.module';
import { CloudinaryModule } from '../cloudinary/cloudinary.module';
import { DoorController, FirebaseRealtimeModule } from '../realtime';
import { GoogleVisionModule } from '../vision';
import { LicencePlateModule } from '../licence-plate/licence-plate.module';
import { LicencePlateController } from '../licence-plate/licence-plate.controller';

@Module({
  imports: [
    UserModule,
    CoreModule,
    HttpModule,
    DataModule,
    CloudinaryModule,
    FirebaseRealtimeModule,
    GoogleVisionModule,
    LicencePlateModule,
  ],
  controllers: [
    UserController,
    DataController,
    DoorController,
    AdminUserController,
    LicencePlateController,
  ],
  providers: [Logger],
})
export class RouterCommonModule {}
