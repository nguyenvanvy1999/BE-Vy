import { registerAs } from '@nestjs/config';

export interface IFileConfig {
  fieldNameSize: number;
  fieldSize: number;
  maxFileSize: number;
  maxFiles: number;
}

export const fnFileConfig = (): IFileConfig => ({
  fieldNameSize: 100, // in bytes
  fieldSize: 524_288, // 500 KB
  maxFileSize: 104_858, // 100 KB
  maxFiles: 2, // 2 files
});

export const fileConfig = registerAs('file', fnFileConfig);
