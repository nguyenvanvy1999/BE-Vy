import { FirebaseAdminModule } from '@cuaklabs/nestjs-firebase-admin';
import { Module } from '@nestjs/common';
import { Auth } from 'firebase-admin/auth';
import { SocketCollectionModule } from '../events/collections';
import { UserCollectionModule } from '../user/collections';
import { MessageGateway } from './message.gateway';

@Module({
  imports: [
    UserCollectionModule,
    SocketCollectionModule,
    FirebaseAdminModule.injectProviders([Auth]),
  ],
  providers: [MessageGateway],
  controllers: [],
})
export class GatewayModules {}
