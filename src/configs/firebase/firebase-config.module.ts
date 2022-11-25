import { Module, Global } from '@nestjs/common';
import { FirebaseAdminModule } from '@cuaklabs/nestjs-firebase-admin';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { AppOptions } from 'firebase-admin';
import firebase from 'firebase-admin';

@Global()
@Module({
  imports: [
    FirebaseAdminModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService): AppOptions => {
        return {
          databaseURL: configService.get('firebase.databaseUrl'),
          credential: firebase.credential.cert({
            projectId: configService.get('firebase.projectId'),
            clientEmail: configService.get('firebase.clientEmail'),
            privateKey: configService.get('firebase.privateKey'),
          }),
        };
      },
    }),
  ],
})
export class FirebaseConfigModule {}
