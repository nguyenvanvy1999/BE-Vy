import { Global, Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { PassportModule } from '@nestjs/passport';
import { AuthService } from '@src/modules/auth/services';
import { DeviceModule } from '@src/modules/device/device.module';

import { JwtStrategy } from './strategies';

@Global()
@Module({
  imports: [PassportModule.register({ defaultStrategy: 'jwt' }), DeviceModule, ConfigModule],
  providers: [JwtStrategy, AuthService],
  exports: [JwtStrategy, PassportModule, AuthService],
})
export class AuthModule {}
