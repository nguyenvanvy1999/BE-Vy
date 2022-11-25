import { ConfigService } from '@nestjs/config';
import { v2 } from 'cloudinary';

export const CloudinaryProvider = {
  provide: 'Cloudinary',
  useFactory: (configService: ConfigService) =>
    v2.config(configService.get('cld')),

  inject: [ConfigService, { token: 'ConfigService', optional: true }],
};
