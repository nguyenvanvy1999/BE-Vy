import { registerAs } from '@nestjs/config';

export interface IHelperConfig {
  salt: {
    length: number;
  };
  jwt: {
    secretKey: string;
    expirationTime: string;
    notBeforeExpirationTime: string;
  };
}

export const fnHelperConfig = (): IHelperConfig => ({
  salt: {
    length: 8,
  },
  jwt: {
    secretKey: '123456',
    expirationTime: '1h',
    notBeforeExpirationTime: '0',
  },
});

export const helperConfig = registerAs('helper', fnHelperConfig);
