import { Global, Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { PassportModule } from '@nestjs/passport';
import { AuthService } from '@src/modules/auth/services';

import { UserCollectionModule } from '../user/collections';
import { JwtStrategy } from './strategies';

@Global()
@Module({
  imports: [PassportModule.register({ defaultStrategy: 'jwt' }), ConfigModule, UserCollectionModule],
  providers: [JwtStrategy, AuthService],
  exports: [JwtStrategy, PassportModule, AuthService],
})
export class AuthModule {}
