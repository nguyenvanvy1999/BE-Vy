import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import type { DeviceTokenDocument } from '@src/modules/device-token/schemas';
import { DeviceTokenSchema } from '@src/modules/device-token/schemas';
import type { FilterQuery } from 'mongoose';
import { Model, Types } from 'mongoose';

@Injectable()
export class DeviceTokenService {
  constructor(@InjectModel(DeviceTokenSchema.name) private readonly tokenModel: Model<DeviceTokenDocument>) {}

  public async createToken(deviceId: string, token: string, IPAddress: string): Promise<DeviceTokenDocument> {
    return this.tokenModel.create({ _id: new Types.ObjectId(), deviceId, token, IPAddress });
  }

  public async findOne(filter?: FilterQuery<DeviceTokenDocument>, projection?: string): Promise<DeviceTokenDocument> {
    return this.tokenModel.findOne(filter, projection).lean();
  }

  public async checkExistByDeviceId(deviceId: string): Promise<null | { _id: string }> {
    const isTokenExist = await this.tokenModel.exists({ deviceId }).lean();

    if (isTokenExist) {
      return { _id: isTokenExist._id.toString() };
    }

    return null;
  }

  public async updateToken(_id: string, token: string): Promise<DeviceTokenDocument> {
    return this.tokenModel.findByIdAndUpdate(_id, { token }).lean();
  }

  public async deleteTokenByDeviceId(deviceId: string): Promise<void> {
    await this.tokenModel.deleteMany({ deviceId });
  }
}
