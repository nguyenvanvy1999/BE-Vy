import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import type { DeviceDocument } from '@src/modules/device/schemas';
import { DeviceService } from '@src/modules/device/services';
import { ExtractJwt, Strategy as BaseStrategy } from 'passport-jwt';

import type { IJwtPayload } from '../interfaces';

@Injectable()
export class JwtStrategy extends PassportStrategy(BaseStrategy) {
  constructor(private readonly configService: ConfigService, private readonly deviceService: DeviceService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: configService.get<string>('auth.jwt.accessToken.secretKey'),
    });
  }

  async validate(payload: IJwtPayload): Promise<DeviceDocument> {
    if (!payload._id) {
      throw new UnauthorizedException('Wrong token!');
    }

    const device = await this.deviceService.findOne({ _id: payload._id }, '_id deviceName SN deviceMAC');

    if (!device) {
      throw new UnauthorizedException('Device not found!');
    }

    return device;
  }
}
