import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import type { DeviceCreateReqDTO, DeviceStatus } from '@src/modules/device/dto';
import type { DeviceDocument } from '@src/modules/device/schemas';
import { DeviceSchema } from '@src/modules/device/schemas';
import type { DeleteResult, ObjectId } from 'mongodb';
import type { FilterQuery } from 'mongoose';
import { Model } from 'mongoose';

@Injectable()
export class DeviceService {
  constructor(@InjectModel(DeviceSchema.name) private readonly deviceModel: Model<DeviceDocument>) {}

  public async checkExistBySNAndMAC(SN: string, deviceMAC: string): Promise<null | { _id: string }> {
    const isDeviceExist = await this.deviceModel.exists({ SN, deviceMAC });

    if (isDeviceExist) {
      return { _id: isDeviceExist._id.toString() };
    }

    return null;
  }

  public async findOne(filter?: FilterQuery<DeviceDocument>, projection?: string): Promise<DeviceDocument> {
    return this.deviceModel.findOne(filter, projection).lean();
  }

  public async findById(_id: string | ObjectId, projection?: string): Promise<DeviceDocument> {
    return this.deviceModel.findById(_id, projection);
  }

  public async changeDeviceStatus(_id: string, status: DeviceStatus): Promise<DeviceDocument> {
    return this.deviceModel.findByIdAndUpdate(_id, { status }).lean();
  }

  public createDevice(dto: DeviceCreateReqDTO): Promise<DeviceDocument> {
    return this.deviceModel.create(dto);
  }

  public createManyDevice(devices: DeviceCreateReqDTO[]): Promise<DeviceDocument[]> {
    return this.deviceModel.insertMany(devices);
  }

  async deleteMany(filter?: FilterQuery<DeviceDocument>): Promise<DeleteResult> {
    return this.deviceModel.deleteMany(filter);
  }
}
