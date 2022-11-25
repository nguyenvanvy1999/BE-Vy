import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt } from 'passport-jwt';
import {
  FirebaseAuthStrategy,
  FirebaseUser,
} from '@tfarras/nestjs-firebase-auth';
import { UserCollection } from '../../user/collections';

@Injectable()
export class FirebaseIdTokenStrategy extends PassportStrategy(
  FirebaseAuthStrategy,
  'firebase',
) {
  public constructor(private readonly userCollection: UserCollection) {
    super({
      extractor: ExtractJwt.fromAuthHeaderAsBearerToken(),
    });
  }

  validate(payload: FirebaseUser): Promise<any> {
    return this.userCollection.getUserByFirebaseUid(payload.uid);
  }
}
