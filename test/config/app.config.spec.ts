import { Environment } from '@src/configs';
import type { IAppConfig } from '@src/configs/env/config';
import { fnAppConfig } from '@src/configs/env/config';

const setEnv = (): void => {
  process.env.APP_NAME = 'Do_An';
  process.env.APP_ENV = Environment.DEVELOPMENT;
  process.env.APP_MODE = 'simple';
  process.env.APP_LANGUAGE = 'en';
  process.env.APP_TZ = 'Asia/Jakarta';
  process.env.APP_HOST = 'localhost';
  process.env.APP_PORT = '3000';
  process.env.APP_VERSIONING = 'false';
  process.env.APP_DEBUG = 'false';
  process.env.APP_HTTP_ON = 'true';
  process.env.APP_TASK_ON = 'false';
  process.env.APP_MICROSERVICE_ON = 'false';
};

const unsetEnv = (): void => {
  delete process.env.APP_NAME;
  delete process.env.APP_ENV;
  delete process.env.APP_MODE;
  delete process.env.APP_LANGUAGE;
  delete process.env.APP_TZ;
  delete process.env.APP_HOST;
  delete process.env.APP_PORT;
  delete process.env.APP_VERSIONING;
  delete process.env.APP_DEBUG;
  delete process.env.APP_HTTP_ON;
  delete process.env.APP_TASK_ON;
  delete process.env.APP_MICROSERVICE_ON;
};

describe('App config test', () => {
  const appConfig: IAppConfig = {
    name: 'Do_An',
    env: Environment.DEVELOPMENT,
    mode: 'simple',
    language: 'en',
    timezone: 'Asia/Jakarta',
    http: {
      host: 'localhost',
      port: 3000,
    },
    versioning: false,
    debug: false,
    debugger: {
      http: {
        maxFiles: 5,
        maxSize: '2M',
      },
      system: {
        active: false,
        maxFiles: '7d',
        maxSize: '2m',
      },
    },
    httpOn: true,
    taskOn: false,
    microserviceOn: false,
  };

  it('Should return app config', () => {
    setEnv();
    const config = fnAppConfig();
    expect(config).toStrictEqual(appConfig);
  });

  it('Should return default config when no env file found', () => {
    unsetEnv();
    const config = fnAppConfig();
    expect(config).toStrictEqual(appConfig);
  });

  it('Should throw error when host wrong', () => {
    setEnv();
    process.env.APP_HOST = 'wrong_url';
    expect(() => fnAppConfig()).toThrow();
  });

  it('Should throw new error when port wrong', () => {
    setEnv();
    process.env.APP_PORT = '1000000';
    expect(() => fnAppConfig()).toThrow();
  });
});
