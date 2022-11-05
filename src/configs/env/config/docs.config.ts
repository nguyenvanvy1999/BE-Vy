import { registerAs } from '@nestjs/config';
import { envValidate } from '@src/configs';
import { Transform, Type } from 'class-transformer';
import { IsBoolean, IsOptional, IsString } from 'class-validator';

export class DocsConfigDTO {
  @IsBoolean()
  @IsOptional()
  @Transform(({ value }) => value === 'true', { toClassOnly: true })
  public SWAGGER_ENABLE = false;

  @IsBoolean()
  @IsOptional()
  @Transform(({ value }) => value === 'true', { toClassOnly: true })
  public SWAGGER_WRITE = false;

  @IsBoolean()
  @IsOptional()
  @Transform(({ value }) => value === 'true', { toClassOnly: true })
  public REDOC_ENABLE = false;

  @IsBoolean()
  @IsOptional()
  @Transform(({ value }) => value === 'true', { toClassOnly: true })
  public ASYNC_API_ENABLE = false;

  @IsBoolean()
  @IsOptional()
  @Transform(({ value }) => value === 'true', { toClassOnly: true })
  public REDOC_AUTH_ENABLE = false;

  @IsString()
  @IsOptional()
  @Type(() => String)
  public REDOC_USERNAME?: string;

  @IsString()
  @IsOptional()
  @Type(() => String)
  public REDOC_PASSWORD?: string;
}

export interface IDocsConfig {
  swagger: {
    enable: boolean;
    write: boolean;
  };
  asyncApi: {
    enable: boolean;
  };
  redoc: {
    enable: boolean;
    auth: {
      enable: boolean;
      username?: string;
      password?: string;
    };
  };
}

export const fnDocsConfig = (): IDocsConfig => {
  const config = envValidate<DocsConfigDTO>(process.env, DocsConfigDTO);

  return {
    swagger: {
      enable: config.SWAGGER_ENABLE,
      write: config.SWAGGER_WRITE,
    },
    asyncApi: {
      enable: config.ASYNC_API_ENABLE,
    },
    redoc: {
      enable: config.REDOC_ENABLE,
      auth: {
        enable: config.REDOC_AUTH_ENABLE,
        username: config.REDOC_USERNAME,
        password: config.REDOC_PASSWORD,
      },
    },
  };
};

export const docsConfig = registerAs('docs', fnDocsConfig);
