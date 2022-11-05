import type { IDocsConfig } from '@src/configs/env/config';
import { fnDocsConfig } from '@src/configs/env/config';

const setEnv = (): void => {
  process.env.SWAGGER_ENABLE = 'false';
  process.env.SWAGGER_WRITE = 'false';
  process.env.REDOC_ENABLE = 'false';
  process.env.ASYNC_API_ENABLE = 'false';
  process.env.REDOC_AUTH_ENABLE = 'false';
  process.env.REDOC_USERNAME = 'username';
  process.env.REDOC_PASSWORD = 'password';
};

const unsetEnv = (): void => {
  delete process.env.SWAGGER_ENABLE;
  delete process.env.SWAGGER_WRITE;
  delete process.env.REDOC_ENABLE;
  delete process.env.ASYNC_API_ENABLE;
  delete process.env.REDOC_AUTH_ENABLE;
};

describe('Docs config test', () => {
  const docsConfig: IDocsConfig = {
    swagger: {
      enable: false,
      write: false,
    },
    asyncApi: {
      enable: false,
    },
    redoc: {
      enable: false,
      auth: {
        enable: false,
        username: 'username',
        password: 'password',
      },
    },
  };

  it('Should return docs config', () => {
    setEnv();
    const config = fnDocsConfig();
    expect(config).toStrictEqual(docsConfig);
  });

  it('Should return default value when some value unset', () => {
    unsetEnv();
    const config = fnDocsConfig();
    expect(config).toStrictEqual(docsConfig);
  });

  describe('If REDOC_AUTH_ENABLE === true then REDOC_USERNAME and REDOC_PASSWORD required', () => {
    beforeEach(() => {
      setEnv();
      process.env.REDOC_AUTH_ENABLE = 'true';
    });

    it('Error: Should throw error when no REDOC_USERNAME', () => {
      delete process.env.REDOC_USERNAME;
      expect(() => fnDocsConfig()).toThrowError();
    });

    it('Error: Should throw error when no REDOC_PASSWORD', () => {
      delete process.env.REDOC_PASSWORD;
      expect(() => fnDocsConfig()).toThrowError();
    });

    it('Success: Should return value when REDOC_USERNAME and REDOC_PASSWORD correct', () => {
      const res = fnDocsConfig();
      const newConfig = { ...docsConfig };
      newConfig.redoc.auth.enable = true;
      expect(res).toStrictEqual(newConfig);
    });
  });
});
