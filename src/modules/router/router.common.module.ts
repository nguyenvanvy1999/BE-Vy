import { Module } from '@nestjs/common';
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

@Module({
  imports: [
    UserModule,
    CoreModule,
    HttpModule,
    DataModule,
    CloudinaryModule,
    FirebaseRealtimeModule,
  ],
  controllers: [
    UserController,
    DataController,
    DoorController,
    AdminUserController,
  ],
})
export class RouterCommonModule {}
