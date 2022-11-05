import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import type { UserDocument } from '@src/modules/user/schemas';
import { UserSchema } from '@src/modules/user/schemas';
import type { DeleteResult } from 'mongodb';
import { Model } from 'mongoose';

@Injectable()
export class UserBulkService {
  constructor(
    @InjectModel(UserSchema.name)
    private readonly userModel: Model<UserDocument>,
  ) {}

  async deleteMany(find: Record<string, any>): Promise<DeleteResult> {
    return this.userModel.deleteMany(find);
  }
}
