import { registerAs } from '@nestjs/config';
import { envValidate } from '@src/configs';
import { Type } from 'class-transformer';
import { IsOptional, IsString } from 'class-validator';

export class AuthConfigDTO {
  @IsString()
  @Type(() => String)
  @IsOptional()
  public AUTH_JWT_ACCESS_TOKEN_SECRET_KEY? = '123456';

  @IsString()
  @Type(() => String)
  @IsOptional()
  public AUTH_JWT_ACCESS_TOKEN_EXPIRED? = '1h';

  @IsString()
  @Type(() => String)
  @IsOptional()
  public AUTH_JWT_REFRESH_TOKEN_SECRET_KEY? = '123456000';

  @IsString()
  @Type(() => String)
  @IsOptional()
  public AUTH_JWT_REFRESH_TOKEN_EXPIRED? = '30d';

  @IsString()
  @IsOptional()
  @Type(() => String)
  public JWT_NOT_BEFORE_EXPIRES_IN = '30d';
}

export interface IAuthConfig {
  jwt: {
    accessToken: {
      secretKey: string;
      expirationTime: string;
      notBeforeExpirationTime: string;
    };

    refreshToken: {
      secretKey: string;
      expirationTime: string;
      expirationTimeRememberMe: string;
      notBeforeExpirationTime: string;
    };
  };

  password: {
    saltLength: number;
    expiredInDay: number;
  };
}

export const fnAuthConfig = (): IAuthConfig => {
  const config = envValidate<AuthConfigDTO>(process.env, AuthConfigDTO);

  return {
    jwt: {
      accessToken: {
        secretKey: config.AUTH_JWT_ACCESS_TOKEN_SECRET_KEY,
        expirationTime: config.AUTH_JWT_ACCESS_TOKEN_EXPIRED, // recommendation for production is 30m
        notBeforeExpirationTime: '0', // keep it in zero value
      },
      refreshToken: {
        secretKey: config.AUTH_JWT_REFRESH_TOKEN_SECRET_KEY,
        expirationTime: '7d', // recommendation for production is 7d
        expirationTimeRememberMe: config.AUTH_JWT_REFRESH_TOKEN_EXPIRED, // recommendation for production is 30d
        notBeforeExpirationTime: config.AUTH_JWT_ACCESS_TOKEN_EXPIRED, // recommendation for production is 30m
      },
    },
    password: {
      saltLength: 8,
      expiredInDay: 182, // recommendation for production is 182 days
    },
  };
};

export const authConfig = registerAs('auth', fnAuthConfig);
