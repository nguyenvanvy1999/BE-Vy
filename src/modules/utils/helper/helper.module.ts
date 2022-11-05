import { Global, Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { HelperArrayService } from '@src/modules/utils/helper/service/helper.array.service';
import { HelperDateService } from '@src/modules/utils/helper/service/helper.date.service';
import { HelperEncryptionService } from '@src/modules/utils/helper/service/helper.encryption.service';
import { HelperFileService } from '@src/modules/utils/helper/service/helper.file.service';
import { HelperHashService } from '@src/modules/utils/helper/service/helper.hash.service';
import { HelperNumberService } from '@src/modules/utils/helper/service/helper.number.service';
import { HelperObjectService } from '@src/modules/utils/helper/service/helper.object.service';
import { HelperService } from '@src/modules/utils/helper/service/helper.service';
import { HelperStringService } from '@src/modules/utils/helper/service/helper.string.service';

@Global()
@Module({
  providers: [
    HelperService,
    HelperArrayService,
    HelperDateService,
    HelperEncryptionService,
    HelperHashService,
    HelperNumberService,
    HelperStringService,
    HelperFileService,
    ConfigService,
    HelperObjectService,
  ],
  exports: [
    HelperService,
    HelperArrayService,
    HelperDateService,
    HelperEncryptionService,
    HelperHashService,
    HelperNumberService,
    HelperStringService,
    HelperFileService,
    HelperObjectService,
  ],
  controllers: [],
  imports: [
    ConfigModule,
    JwtModule.registerAsync({
      inject: [ConfigService],
      imports: [ConfigModule],
      useFactory: (config: ConfigService) => ({
        secret: config.get<string>('auth.jwt.accessToken.secretKey'),
        signOptions: {
          expiresIn: config.get<string>('auth.jwt.accessToken.expirationTime'),
        },
      }),
    }),
  ],
})
export class HelperModule {}
