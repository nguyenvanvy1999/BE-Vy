import type { IUserConfig } from '@src/configs/env/config';
import { fnUserConfig } from '@src/configs/env/config';

describe('User config test', () => {
  it('Should return user config', () => {
    process.env.APP_ENV = 'development';
    const userConfig: IUserConfig = { uploadPath: '/test/user' };
    const config = fnUserConfig();
    expect(config).toStrictEqual(userConfig);
  });

  it('Should return user config when APP_ENV is production', () => {
    process.env.APP_ENV = 'production';
    const userConfig: IUserConfig = { uploadPath: '/user' };
    const config = fnUserConfig();
    expect(config).toStrictEqual(userConfig);
  });
});
