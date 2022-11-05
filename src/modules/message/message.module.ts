import { Global, Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { HeaderResolver, I18nJsonLoader, I18nModule } from 'nestjs-i18n';
import path from 'path';

import { EMessageLanguage } from './message.constant';
import { MessageService } from './service/message.service';

@Global()
@Module({
  providers: [MessageService, ConfigService],
  exports: [MessageService],
  imports: [
    ConfigModule,
    I18nModule.forRootAsync({
      useFactory: (configService: ConfigService) => ({
        fallbackLanguage: configService.get<string>('app.language'),
        fallbacks: Object.values(EMessageLanguage).reduce((a, v) => ({ ...a, [`${v}-*`]: v }), {}),
        loaderOptions: {
          path: path.join(__dirname, '/languages/'),
          watch: true,
        },
      }),
      loader: I18nJsonLoader,
      inject: [ConfigService],
      resolvers: [new HeaderResolver(['x-custom-lang'])],
      imports: [ConfigModule],
    }),
  ],
  controllers: [],
})
export class MessageModule {}
