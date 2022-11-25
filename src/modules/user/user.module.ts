import { FirebaseAdminModule } from '@cuaklabs/nestjs-firebase-admin';
import { Module } from '@nestjs/common';
import { Auth } from 'firebase-admin/auth';
import { UserCollectionModule } from './collections';

import { UserService } from './services';

@Module({
  imports: [UserCollectionModule, FirebaseAdminModule.injectProviders([Auth])],
  exports: [UserService],
  providers: [UserService],
  controllers: [],
})
export class UserModule {}
