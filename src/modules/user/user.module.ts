import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { DATABASE_CONNECTION_NAME } from '@src/configs/database/database.constant';
import { userDatabaseName, userModel, UserSchema } from '@src/modules/user/schemas';

import { UserBulkService, UserService } from './services';

@Module({
  imports: [
    MongooseModule.forFeature(
      [
        {
          name: UserSchema.name,
          schema: userModel,
          collection: userDatabaseName,
        },
      ],
      DATABASE_CONNECTION_NAME,
    ),
  ],
  exports: [UserService, UserBulkService],
  providers: [UserService, UserBulkService],
  controllers: [],
})
export class UserModule {}
