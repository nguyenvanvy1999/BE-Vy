import type { IHelperConfig } from '@src/configs/env/config';
import { fnHelperConfig } from '@src/configs/env/config';

describe('Helper config test', () => {
  it('Should return helper config', () => {
    const helperConfig: IHelperConfig = {
      salt: {
        length: 8,
      },
      jwt: {
        secretKey: '123456',
        expirationTime: '1h',
        notBeforeExpirationTime: '0',
      },
    };
    const config = fnHelperConfig();
    expect(config).toStrictEqual(helperConfig);
  });
});
