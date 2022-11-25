import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Types } from 'mongoose';
import { Model } from 'mongoose';
import { ECollectionName } from '../../utils/database';
import { UserNotFoundException } from '../exceptions';
import { User } from '../schemas';

@Injectable()
export class UserCollection {
  constructor(
    @InjectModel(ECollectionName.USER) private readonly userModel: Model<User>,
  ) {}

  public async checkExistByEmail(email: string): Promise<boolean> {
    const user = await this.userModel.exists({ email });
    return !!user;
  }

  public createUser(user: User): Promise<User> {
    return this.userModel.create(user);
  }

  public async getUserByFirebaseUid(uid: string): Promise<User> {
    const user = await this.userModel.findOne({ firebaseUid: uid });
    if (!user) {
      throw new UserNotFoundException();
    }
    return user;
  }

  public async getUserById(id: Types.ObjectId): Promise<User> {
    const user = await this.userModel.findById(id);
    if (!user) {
      throw new UserNotFoundException();
    }
    return user;
  }

  public async checkExistById(
    _id: Types.ObjectId,
    throwError = false,
  ): Promise<boolean> {
    const exist = await this.userModel.exists({ _id });
    if (!exist && throwError) {
      throw new UserNotFoundException();
    }
    return !!exist;
  }
}
