/* eslint-disable unicorn/no-null */
import { registerAs } from '@nestjs/config';
import { envValidate } from '@src/configs';
import { Transform, Type } from 'class-transformer';
import { IsBoolean, IsOptional, IsString } from 'class-validator';

export class DatabaseConfigDTO {
  @IsString()
  @Type(() => String)
  @IsOptional()
  public DATABASE_HOST? = 'mongodb://localhost:27017';

  @IsString()
  @Type(() => String)
  @IsOptional()
  public DATABASE_NAME? = 'mesh';

  @IsString()
  @Type(() => String)
  @IsOptional()
  public DATABASE_USER?: string;

  @IsString()
  @Type(() => String)
  @IsOptional()
  public DATABASE_PASSWORD?: string;

  @IsString()
  @Type(() => String)
  @IsOptional()
  public DATABASE_OPTIONS?: string;

  @IsBoolean()
  @IsOptional()
  @Transform(({ value }) => value === true, { toClassOnly: true })
  public DATABASE_DEBUG? = false;
}

export interface IDatabaseConfig {
  host: string;
  name: string;
  user: string;
  password: string;
  debug: boolean;
  options: string;
}

export const fnDatabaseConfig = (): IDatabaseConfig => {
  const config = envValidate<DatabaseConfigDTO>(process.env, DatabaseConfigDTO);

  return {
    host: config.DATABASE_HOST,
    name: config.DATABASE_NAME,
    user: config.DATABASE_USER || null,
    password: config.DATABASE_PASSWORD || null,
    debug: config.DATABASE_DEBUG,
    options: config.DATABASE_OPTIONS,
  };
};

export const databaseConfig = registerAs('database', fnDatabaseConfig);
