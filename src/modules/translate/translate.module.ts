import { Global, Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { HeaderResolver, I18nJsonLoader, I18nModule } from 'nestjs-i18n';
import path from 'path';

import { ETranslateLanguage } from './translate.constant';
import { TranslateService } from './service';

@Global()
@Module({
  providers: [TranslateService, ConfigService],
  exports: [TranslateService],
  imports: [
    ConfigModule,
    I18nModule.forRootAsync({
      useFactory: (configService: ConfigService) => ({
        fallbackLanguage: configService.get<string>('app.language'),
        fallbacks: Object.values(ETranslateLanguage).reduce(
          (a, v) => ({ ...a, [`${v}-*`]: v }),
          {},
        ),
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
export class TranslateModule {}
