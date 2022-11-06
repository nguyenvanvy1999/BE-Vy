import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { userDatabaseName, userModel, UserSchema } from '@src/modules/user/schemas';

import { UserCollection } from './user.collection';

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
  exports: [],
  providers: [UserCollection],
  controllers: [UserCollection],
})
export class UserCollectionModule {}
