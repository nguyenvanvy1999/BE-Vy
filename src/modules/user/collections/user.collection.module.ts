import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ECollectionName } from '../../utils/database';
import { UserSchema } from '../schemas';
import { UserCollection } from './user.collection';

@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: ECollectionName.USER,
        schema: UserSchema,
        collection: ECollectionName.USER,
      },
    ]),
  ],
  providers: [UserCollection],
  exports: [UserCollection],
})
export class UserCollectionModule {}
