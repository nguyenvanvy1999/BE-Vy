import type { IAuthConfig } from '@src/configs/env/config';
import { fnAuthConfig } from '@src/configs/env/config';

const setEnv = () => {
  process.env.AUTH_JWT_ACCESS_TOKEN_SECRET_KEY = '123456';
  process.env.AUTH_JWT_ACCESS_TOKEN_EXPIRED = '1h';
  process.env.AUTH_JWT_REFRESH_TOKEN_SECRET_KEY = '123456000';
  process.env.AUTH_JWT_REFRESH_TOKEN_EXPIRED = '30d';
  process.env.JWT_NOT_BEFORE_EXPIRES_IN = '30d';
};

const unsetEnv = () => {
  delete process.env.AUTH_JWT_ACCESS_TOKEN_SECRET_KEY;
  delete process.env.AUTH_JWT_ACCESS_TOKEN_EXPIRED;
  delete process.env.AUTH_JWT_REFRESH_TOKEN_SECRET_KEY;
  delete process.env.AUTH_JWT_REFRESH_TOKEN_EXPIRED;
  delete process.env.JWT_NOT_BEFORE_EXPIRES_IN;
};

describe('Auth config test', () => {
  const authConfig: IAuthConfig = {
    jwt: {
      accessToken: {
        secretKey: '123456',
        expirationTime: '1h',
        notBeforeExpirationTime: '0',
      },
      refreshToken: {
        secretKey: '123456000',
        expirationTime: '7d',
        expirationTimeRememberMe: '30d',
        notBeforeExpirationTime: '1h',
      },
    },
    password: {
      saltLength: 8,
      expiredInDay: 182,
    },
  };

  it('Should return auth config', () => {
    setEnv();
    const config = fnAuthConfig();
    expect(config).toStrictEqual(authConfig);
  });

  it('Should return default value when no env', () => {
    unsetEnv();
    const config = fnAuthConfig();
    expect(config).toStrictEqual(authConfig);
  });
});
