import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { ObjectId } from 'mongodb';
import { FilterQuery, Model, UpdateQuery } from 'mongoose';
import { ECollectionName, IDatabaseFindAllOptions } from '../../utils/database';
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

  public async getUserById(id: ObjectId): Promise<User> {
    const user = await this.userModel.findById(id);
    if (!user) {
      throw new UserNotFoundException();
    }
    return user;
  }

  public async checkExistById(
    _id: ObjectId,
    throwError = false,
  ): Promise<boolean> {
    const exist = await this.userModel.exists({ _id });
    if (!exist && throwError) {
      throw new UserNotFoundException();
    }
    return !!exist;
  }

  public async updateOneUser(
    filter: FilterQuery<User>,
    data: UpdateQuery<User>,
  ): Promise<User> {
    return await this.userModel.findOneAndUpdate(filter, data, { new: true });
  }

  public async findAll(
    filter?: FilterQuery<User>,
    options?: IDatabaseFindAllOptions,
  ): Promise<User[]> {
    const users = this.userModel.find(filter);

    if (options?.limit !== undefined && options?.skip !== undefined) {
      users.limit(options.limit).skip(options.skip);
    }

    if (options?.sort) {
      users.sort(options.sort);
    }

    return users.lean();
  }

  public async deleteUser(id: ObjectId): Promise<void> {
    await this.userModel.findByIdAndDelete(id);
  }
}
