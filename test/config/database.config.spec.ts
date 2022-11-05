/* eslint-disable unicorn/no-null */
import type { IDatabaseConfig } from '@src/configs/env/config';
import { fnDatabaseConfig } from '@src/configs/env/config';

const setEnv = (): void => {
  process.env.DATABASE_HOST = 'mongodb://localhost:27017';
  process.env.DATABASE_NAME = 'mesh';
  process.env.DATABASE_USER = 'user';
  process.env.DATABASE_PASSWORD = 'password';
  process.env.DATABASE_OPTIONS = 'options';
  process.env.DATABASE_DEBUG = 'false';
};

const unsetEnv = (): void => {
  delete process.env.DATABASE_HOST;
  delete process.env.DATABASE_NAME;
  delete process.env.DATABASE_DEBUG;
};

describe('Database config test', () => {
  const databaseConfig: IDatabaseConfig = {
    host: 'mongodb://localhost:27017',
    name: 'mesh',
    user: 'user',
    password: 'password',
    debug: false,
    options: 'options',
  };

  it('Should return value', () => {
    setEnv();
    const config = fnDatabaseConfig();
    expect(config).toStrictEqual(databaseConfig);
  });

  it('Should return default value when some value unset', () => {
    unsetEnv();
    const config = fnDatabaseConfig();
    expect(config).toStrictEqual(databaseConfig);
  });

  it('Should return null when DATABASE_USER unset', () => {
    setEnv();
    delete process.env.DATABASE_USER;
    const config = fnDatabaseConfig();
    expect(config).toStrictEqual({ ...databaseConfig, user: null });
  });

  it('Should return null when DATABASE_PASSWORD unset', () => {
    setEnv();
    delete process.env.DATABASE_PASSWORD;
    const config = fnDatabaseConfig();
    expect(config).toStrictEqual({ ...databaseConfig, password: null });
  });

  it('Should not return value when DATABASE_OPTIONS unset', () => {
    setEnv();
    delete process.env.DATABASE_OPTIONS;
    const config = fnDatabaseConfig();
    expect(config).toStrictEqual({ ...databaseConfig, options: undefined });
  });
});
