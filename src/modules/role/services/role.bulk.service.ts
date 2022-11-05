import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import type { DeleteResult } from 'mongodb';
import { Model } from 'mongoose';

import type { RoleDocument } from '../schemas/role.schema';
import { RoleSchema } from '../schemas/role.schema';

@Injectable()
export class RoleBulkService {
  constructor(
    @InjectModel(RoleSchema.name)
    private readonly roleModel: Model<RoleDocument>,
  ) {}

  async deleteMany(find: Record<string, any>): Promise<DeleteResult> {
    return this.roleModel.deleteMany(find);
  }
}
