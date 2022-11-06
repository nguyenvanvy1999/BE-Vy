import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy as BaseStrategy } from 'passport-jwt';

import { UserCollection } from '../../user/collections';
import type { UserDocument } from '../../user/schemas';
import type { IJwtPayload } from '../interfaces';

@Injectable()
export class JwtStrategy extends PassportStrategy(BaseStrategy) {
  constructor(private readonly configService: ConfigService, private readonly userCollection: UserCollection) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: configService.get<string>('auth.jwt.accessToken.secretKey'),
    });
  }

  async validate(payload: IJwtPayload): Promise<UserDocument> {
    if (!payload._id) {
      throw new UnauthorizedException('Wrong token!');
    }

    const user = await this.userCollection.findOne({ _id: payload._id });

    if (!user) {
      throw new UnauthorizedException('User not found');
    }

    return user;
  }
}
