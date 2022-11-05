import type { IFileConfig } from '@src/configs/env/config';
import { fnFileConfig } from '@src/configs/env/config';

describe('File config test', () => {
  const fileConfig: IFileConfig = { fieldNameSize: 100, fieldSize: 524_288, maxFileSize: 104_858, maxFiles: 2 };
  it('Should return file config', () => {
    const config = fnFileConfig();
    expect(config).toStrictEqual(fileConfig);
  });
});
