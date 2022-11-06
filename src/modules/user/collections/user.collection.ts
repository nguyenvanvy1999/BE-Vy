import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import type { FilterQuery } from 'mongoose';
import { Model } from 'mongoose';

import type { UserDocument } from '../schemas';
import { UserSchema } from '../schemas';

@Injectable()
export class UserCollection {
  constructor(@InjectModel(UserSchema.name) private readonly userModel: Model<UserDocument>) {}

  public async findOne(filter: FilterQuery<UserSchema>): Promise<UserDocument> {
    return await this.userModel.findOne(filter);
  }
}
