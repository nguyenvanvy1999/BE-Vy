import { InjectFirebaseProvider } from '@cuaklabs/nestjs-firebase-admin';
import { Injectable } from '@nestjs/common';
import { Auth, UpdateRequest, UserRecord } from 'firebase-admin/auth';
import { UserCollection } from '../collections';
import { EAccountType, EUserType } from '../constants';
import { SignUpBodyDTO, UpdateUserDto, UserResDTO } from '../dtos';
import { User } from '../schemas';
import {
  UserEmailExistException,
  CreateFirebaseAccountException,
} from '../exceptions';
import { ObjectId } from 'mongodb';
import { isNotNullAndUndefined } from '../../utils/functions';
import { IDatabaseFindAllOptions } from '../../utils/database';
import { FilterQuery } from 'mongoose';

@Injectable()
export class UserService {
  constructor(
    @InjectFirebaseProvider(Auth) private readonly auth: Auth,
    private readonly userCollection: UserCollection,
  ) {}

  public async signUpWithEmailAndPassword(
    user: SignUpBodyDTO,
    isActive = false,
  ): Promise<UserResDTO> {
    const { email, firstName, lastName, password } = user;
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
        disabled: !isActive,
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
      userType: EUserType.USER,
      isActive,
    } as User);
    return new UserResDTO(newUser);
  }

  public async logout(firebaseUid: string): Promise<void> {
    return this.auth.revokeRefreshTokens(firebaseUid);
  }

  public async updateUser(data: UpdateUserDto): Promise<UserResDTO> {
    const { id, firstName, lastName, isActive, email, password } = data;
    const user = await this.userCollection.getUserById(new ObjectId(id));
    const updateFirebase = {} as UpdateRequest;
    const updateUser = {} as User;
    if (isNotNullAndUndefined(password)) {
      updateFirebase.password = password;
    }
    if (isNotNullAndUndefined(email)) {
      updateFirebase.email = email;
      updateUser.email = email;
    }
    if (isNotNullAndUndefined(firstName)) {
      updateUser.firstName = firstName;
      updateFirebase.displayName = lastName
        ? `${firstName} ${lastName}`
        : `${firstName} ${user.lastName}`;
    }
    if (isNotNullAndUndefined(lastName)) {
      updateUser.lastName = lastName;
      updateFirebase.displayName = firstName
        ? `${firstName} ${lastName}`
        : `${user.firstName} ${lastName}`;
    }
    if (isNotNullAndUndefined(isActive)) {
      updateUser.isActive = isActive;
      updateFirebase.disabled = !isActive;
    }
    if (Object.values(updateFirebase).length) {
      await this.auth.updateUser(user.firebaseUid, { password, email });
    }
    const newUser = await this.userCollection.updateOneUser(
      {
        _id: new ObjectId(id),
      },
      { $set: updateUser },
    );
    return new UserResDTO(newUser);
  }

  public async searchUsers(
    filter?: FilterQuery<User>,
    options?: IDatabaseFindAllOptions,
  ): Promise<UserResDTO[]> {
    const users = await this.userCollection.findAll(filter, options);
    return users.map((x) => new UserResDTO(x));
  }

  public async deleteUser(id: string): Promise<void> {
    const user = await this.userCollection.getUserById(new ObjectId(id));
    await this.auth.deleteUser(user.firebaseUid);
    await this.userCollection.deleteUser(new ObjectId(id));
  }
}
