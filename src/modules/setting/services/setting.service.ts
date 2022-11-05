import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { DebuggerService } from '@src/modules/debugger/services/debugger.service';
import type { SettingCreateReqDTO, SettingUpdateReqDTO } from '@src/modules/setting/dtos';
import { SettingResDTO } from '@src/modules/setting/dtos';
import { SettingNotFoundException } from '@src/modules/setting/exceptions';
import type { IDatabaseFindAllOptions } from '@src/modules/utils/database';
import { HelperStringService } from '@src/modules/utils/helper/service/helper.string.service';
import { plainToInstance } from 'class-transformer';
import type { FilterQuery } from 'mongoose';
import { Model } from 'mongoose';

import type { SettingDocument } from '../schemas/setting.schema';
import { SettingSchema } from '../schemas/setting.schema';

@Injectable()
export class SettingService {
  constructor(
    @InjectModel(SettingSchema.name)
    private readonly settingModel: Model<SettingDocument>,
    private readonly helperStringService: HelperStringService,
    private readonly debugService: DebuggerService,
  ) {}

  async findAll(find?: FilterQuery<SettingDocument>, options?: IDatabaseFindAllOptions): Promise<SettingDocument[]> {
    const settings = this.settingModel.find(find);

    if (options && options.limit !== undefined && options.skip !== undefined) {
      settings.limit(options.limit).skip(options.skip);
    }

    if (options && options.sort) {
      settings.sort(options.sort);
    }

    return settings.lean();
  }

  public async getTotal(find?: FilterQuery<SettingDocument>): Promise<number> {
    return this.settingModel.countDocuments(find);
  }

  public async checkSettingExistById(_id: string): Promise<boolean> {
    const setting = await this.settingModel.exists({ _id });

    if (!setting) {
      this.debugService.error('Setting not found', 'SettingService', 'canActivate');

      throw new SettingNotFoundException();
    }

    return true;
  }

  async findOneById(_id: string): Promise<SettingDocument> {
    return this.settingModel.findById(_id).lean();
  }

  async findOneByName(name: string): Promise<SettingDocument> {
    return this.settingModel.findOne({ name }).lean();
  }

  async create({ name, description, value }: SettingCreateReqDTO): Promise<SettingDocument> {
    let convertValue = value;

    if (typeof value === 'string') {
      convertValue = this.convertValue(value);
    }

    const create: SettingDocument = new this.settingModel({
      name,
      description,
      value: convertValue,
    });

    return create.save();
  }

  async updateOneById(_id: string, { description, value }: SettingUpdateReqDTO): Promise<SettingDocument> {
    let convertValue = value;

    if (typeof value === 'string') {
      convertValue = this.convertValue(value);
    }

    return this.settingModel.findByIdAndUpdate(_id, { description, value: convertValue }).lean();
  }

  serializationList(data: SettingDocument[]): SettingResDTO[] {
    return plainToInstance(SettingResDTO, data);
  }

  serializationGet(data: SettingDocument): SettingResDTO {
    return plainToInstance(SettingResDTO, data);
  }

  async deleteOne(find: FilterQuery<SettingDocument>): Promise<SettingDocument> {
    return this.settingModel.findOneAndDelete(find);
  }

  convertValue(value: string): string | number | boolean {
    return this.helperStringService.convertStringToNumberOrBooleanIfPossible(value);
  }
}
