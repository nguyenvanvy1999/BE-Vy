import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy as BaseStrategy } from 'passport-jwt';

import type { IJwtPayload } from '../interfaces';

@Injectable()
export class JwtStrategy extends PassportStrategy(BaseStrategy) {
  constructor(private readonly configService: ConfigService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: configService.get<string>('auth.jwt.accessToken.secretKey'),
    });
  }

  validate(payload: IJwtPayload): any {
    if (!payload._id) {
      throw new UnauthorizedException('Wrong token!');
    }
  }
}
