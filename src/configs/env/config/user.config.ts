import { registerAs } from '@nestjs/config';

export interface IUserConfig {
  uploadPath: string;
}

export const fnUserConfig = (): IUserConfig => ({
  uploadPath: process.env.APP_ENV === 'production' ? '/user' : '/test/user',
});

export const userConfig = registerAs('user', fnUserConfig);
