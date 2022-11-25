import { FirebaseAdminModule } from '@cuaklabs/nestjs-firebase-admin';
import { Module } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';
import { Auth } from 'firebase-admin/auth';
import { UserCollectionModule } from '../user/collections';
import { FirebaseIdTokenStrategy } from './strategies';

@Module({
  imports: [
    PassportModule,
    UserCollectionModule,
    FirebaseAdminModule.injectProviders([Auth]),
  ],
  providers: [FirebaseIdTokenStrategy],
  exports: [FirebaseIdTokenStrategy],
})
export class AuthModule {}
