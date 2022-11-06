/* eslint-disable @typescript-eslint/no-explicit-any */
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import type { AuthLoginDTO } from '@src/modules/auth/dtos';
import type { IAuthPassword } from '@src/modules/user/user.interface';
import { HelperDateService } from '@src/modules/utils/helper/service/helper.date.service';
import { HelperEncryptionService } from '@src/modules/utils/helper/service/helper.encryption.service';
import { HelperHashService } from '@src/modules/utils/helper/service/helper.hash.service';

import type { IAuthPayloadOptions } from '../interfaces';

@Injectable()
export class AuthService {
  private readonly accessTokenSecretToken: string;

  private readonly accessTokenExpirationTime: string;

  private readonly accessTokenNotBeforeExpirationTime: string;

  private readonly refreshTokenSecretToken: string;

  private readonly refreshTokenExpirationTime: string;

  private readonly refreshTokenExpirationTimeRememberMe: string;

  private readonly refreshTokenNotBeforeExpirationTime: string;

  constructor(
    private readonly helperHashService: HelperHashService,
    private readonly helperDateService: HelperDateService,
    private readonly helperEncryptionService: HelperEncryptionService,
    private readonly configService: ConfigService,
  ) {
    this.accessTokenSecretToken = this.configService.get<string>('auth.jwt.accessToken.secretKey');
    this.accessTokenExpirationTime = this.configService.get<string>('auth.jwt.accessToken.expirationTime');
    this.accessTokenNotBeforeExpirationTime = this.configService.get<string>(
      'auth.jwt.accessToken.notBeforeExpirationTime',
    );

    this.refreshTokenSecretToken = this.configService.get<string>('auth.jwt.refreshToken.secretKey');
    this.refreshTokenExpirationTime = this.configService.get<string>('auth.jwt.refreshToken.expirationTime');
    this.refreshTokenExpirationTimeRememberMe = this.configService.get<string>(
      'auth.jwt.refreshToken.expirationTimeRememberMe',
    );
    this.refreshTokenNotBeforeExpirationTime = this.configService.get<string>(
      'auth.jwt.refreshToken.notBeforeExpirationTime',
    );
  }

  createAccessToken(payload: Record<string, any>): string {
    return this.helperEncryptionService.jwtEncrypt(payload, {
      secretKey: this.accessTokenSecretToken,
      expiredIn: this.accessTokenExpirationTime,
      notBefore: this.accessTokenNotBeforeExpirationTime,
    });
  }

  validateAccessToken(token: string): boolean {
    return this.helperEncryptionService.jwtVerify(token, {
      secretKey: this.accessTokenSecretToken,
    });
  }

  payloadAccessToken(token: string): Record<string, any> {
    return this.helperEncryptionService.jwtDecrypt(token);
  }

  createRefreshToken(payload: Record<string, any>, rememberMe: boolean, test?: boolean): string {
    return this.helperEncryptionService.jwtEncrypt(payload, {
      secretKey: this.refreshTokenSecretToken,
      expiredIn: rememberMe ? this.refreshTokenExpirationTimeRememberMe : this.refreshTokenExpirationTime,
      notBefore: test ? '0' : this.refreshTokenNotBeforeExpirationTime,
    });
  }

  validateRefreshToken(token: string): boolean {
    return this.helperEncryptionService.jwtVerify(token, {
      secretKey: this.refreshTokenSecretToken,
    });
  }

  payloadRefreshToken(token: string): Record<string, any> {
    return this.helperEncryptionService.jwtDecrypt(token);
  }

  validateUser(passwordString: string, passwordHash: string): boolean {
    return this.helperHashService.bcryptCompare(passwordString, passwordHash);
  }

  createPayloadAccessToken(
    data: AuthLoginDTO,
    rememberMe: boolean,
    options?: IAuthPayloadOptions,
  ): Record<string, any> {
    return {
      ...data,
      rememberMe,
      loginDate: options && options.loginDate ? options.loginDate : this.helperDateService.create(),
    };
  }

  createPayloadRefreshToken(_id: string, rememberMe: boolean, options?: IAuthPayloadOptions): Record<string, any> {
    return {
      _id,
      rememberMe,
      loginDate: options && options.loginDate ? options.loginDate : undefined,
    };
  }

  createPassword(password: string): IAuthPassword {
    const saltLength: number = this.configService.get<number>('auth.password.saltLength');

    const salt: string = this.helperHashService.randomSalt(saltLength);

    const passwordExpiredInDays: number = this.configService.get<number>('auth.password.expiredInDay');
    const passwordExpired: Date = this.helperDateService.forwardInDays(passwordExpiredInDays);
    const passwordHash = this.helperHashService.bcrypt(password, salt);

    return {
      passwordHash,
      passwordExpired,
      salt,
    };
  }
}
