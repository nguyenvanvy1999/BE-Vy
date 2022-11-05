import { registerAs } from '@nestjs/config';
import { Environment, envValidate } from '@src/configs';
import { Transform, Type } from 'class-transformer';
import { IsBoolean, IsInt, IsOptional, IsString, IsUrl, Max, Min } from 'class-validator';

export class AppConfigDTO {
  @IsString()
  @Type(() => String)
  @IsOptional()
  public APP_NAME? = 'mesh';

  @IsString()
  @IsOptional()
  public APP_ENV? = Environment.DEVELOPMENT;

  @IsString()
  @Type(() => String)
  @IsOptional()
  public APP_MODE? = 'simple';

  @IsString()
  @Type(() => String)
  @IsOptional()
  public APP_LANGUAGE? = 'en';

  @IsString()
  @Type(() => String)
  @IsOptional()
  public APP_TZ? = 'Asia/Jakarta';

  @IsUrl({ require_tld: false })
  @Type(() => String)
  @IsOptional()
  public APP_HOST? = 'localhost';

  @IsInt()
  @Min(0)
  @Max(65_652)
  @Type(() => Number)
  @IsOptional()
  public APP_PORT? = 3000;

  @IsBoolean()
  @IsOptional()
  @Transform(({ value }) => value === 'true', { toClassOnly: true })
  public APP_VERSIONING? = false;

  @IsBoolean()
  @IsOptional()
  @Transform(({ value }) => value === 'true', { toClassOnly: true })
  public APP_DEBUG? = false;

  @IsBoolean()
  @IsOptional()
  @Transform(({ value }) => value === 'true', { toClassOnly: true })
  public APP_HTTP_ON? = true;

  @IsBoolean()
  @IsOptional()
  @Transform(({ value }) => value === 'true', { toClassOnly: true })
  public APP_TASK_ON? = false;

  @IsBoolean()
  @IsOptional()
  @Transform(({ value }) => value === 'true', { toClassOnly: true })
  public APP_MICROSERVICE_ON? = false;
}

export interface IAppConfig {
  name: string;
  env: Environment;
  mode: string;
  language: string;
  timezone: string;

  http: {
    host: string;
    port: number;
  };
  versioning: boolean;
  debug: boolean;
  debugger: {
    http: {
      maxFiles: number;
      maxSize: string;
    };
    system: {
      active: boolean;
      maxFiles: string;
      maxSize: string;
    };
  };
  httpOn: boolean;
  taskOn: boolean;
  microserviceOn: boolean;
}

export const fnAppConfig = (): IAppConfig => {
  const config = envValidate<AppConfigDTO>(process.env, AppConfigDTO);

  return {
    name: config.APP_NAME,
    env: config.APP_ENV,
    mode: config.APP_MODE,
    language: config.APP_LANGUAGE,
    timezone: config.APP_TZ,

    http: {
      host: config.APP_HOST,
      port: config.APP_PORT,
    },
    versioning: config.APP_VERSIONING,
    debug: config.APP_DEBUG,
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
    httpOn: config.APP_HTTP_ON,
    taskOn: config.APP_TASK_ON,
    microserviceOn: config.APP_MICROSERVICE_ON,
  };
};

export const appConfig = registerAs('app', fnAppConfig);
