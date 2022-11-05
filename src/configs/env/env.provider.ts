import type { ConfigModuleOptions } from '@nestjs/config';
import path from 'path';

import { configs } from './config';

export const configModuleSetup: ConfigModuleOptions = {
  cache: true,
  isGlobal: true,
  load: configs,
  ignoreEnvFile: false,
  envFilePath: [path.join(__dirname, '../../environments/.env')],
};
