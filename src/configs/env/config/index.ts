import { appConfig } from '@src/configs/env/config/app.config';
import { authConfig } from '@src/configs/env/config/auth.config';
import { awsConfig } from '@src/configs/env/config/aws.config';
import { cldConfig } from '@src/configs/env/config/cloudinary.config';
import { databaseConfig } from '@src/configs/env/config/database.config';
import { docsConfig } from '@src/configs/env/config/docs.config';
import { fileConfig } from '@src/configs/env/config/file.config';
import { helperConfig } from '@src/configs/env/config/helper.config';
import { middlewareConfig } from '@src/configs/env/config/middleware.config';
import { userConfig } from '@src/configs/env/config/user.config';

export * from './app.config';
export * from './auth.config';
export * from './aws.config';
export * from './cloudinary.config';
export * from './database.config';
export * from './docs.config';
export * from './file.config';
export * from './helper.config';
export * from './middleware.config';
export * from './user.config';
export const configs = [
  appConfig,
  authConfig,
  databaseConfig,
  helperConfig,
  awsConfig,
  userConfig,
  middlewareConfig,
  fileConfig,
  docsConfig,
  cldConfig,
];
