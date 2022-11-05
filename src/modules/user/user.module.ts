import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { userDatabaseName, userModel, UserSchema } from '@src/modules/user/schemas';

import { UserBulkService, UserService } from './services';

@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: UserSchema.name,
        schema: userModel,
        collection: userDatabaseName,
      },
    ]),
  ],
  exports: [UserService, UserBulkService],
  providers: [UserService, UserBulkService],
  controllers: [],
})
export class UserModule {}
