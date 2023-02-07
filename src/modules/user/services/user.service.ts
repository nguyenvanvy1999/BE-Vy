import { InjectFirebaseProvider } from '@cuaklabs/nestjs-firebase-admin';
import { Injectable } from '@nestjs/common';
import { Auth, UserRecord } from 'firebase-admin/auth';
import { UserCollection } from '../collections';
import { EAccountType } from '../constants';
import { SignUpBodyDTO, UserResDTO } from '../dtos';
import { User } from '../schemas';
import { Types } from 'mongoose';
import {
  UserEmailExistException,
  CreateFirebaseAccountException,
} from '../exceptions';
import { ObjectId } from 'mongodb';

@Injectable()
export class UserService {
  constructor(
    @InjectFirebaseProvider(Auth) private readonly auth: Auth,
    private readonly userCollection: UserCollection,
  ) {}

  public async signUpWithEmailAndPassword(
    user: SignUpBodyDTO,
  ): Promise<UserResDTO> {
    const { email, firstName, lastName, password, userType } = user;
    const isExist = await this.userCollection.checkExistByEmail(user.email);
    const firebaseExist = await this.auth
      .getUserByEmail(email)
      .then(() => true)
      .catch(() => false);

    if (isExist || firebaseExist) {
      throw new UserEmailExistException();
    }
    let firebaseUser: UserRecord;
    try {
      firebaseUser = await this.auth.createUser({
        email,
        emailVerified: true,
        password,
        displayName: `${firstName} ${lastName}`,
        disabled: false,
      });
    } catch (error) {
      throw new CreateFirebaseAccountException();
    }
    const newUser = await this.userCollection.createUser({
      _id: new ObjectId(),
      email,
      firstName,
      lastName,
      accountType: EAccountType.EMAIL,
      firebaseUid: firebaseUser.uid,
      userType,
    } as User);
    return new UserResDTO(newUser);
  }

  public async logout(firebaseUid: string): Promise<void> {
    return this.auth.revokeRefreshTokens(firebaseUid);
  }
}
