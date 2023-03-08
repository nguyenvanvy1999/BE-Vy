import { Model } from 'mongoose';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { LicencePlate } from './licence-plate.schema';
import { ECollectionName } from '../utils/database';
import { AddLicencePlateDto } from './dtos/add.dto';
import { EditLicencePlateDto } from './dtos/edit.dto';
import { LicencePlateResDto } from './dtos/res.dto';
import { ObjectId } from 'mongodb';

@Injectable()
export class LicencePlateService {
  constructor(
    @InjectModel(ECollectionName.LICENCE_PLATES)
    private readonly model: Model<LicencePlate>,
  ) {}

  async add(body: AddLicencePlateDto): Promise<LicencePlateResDto> {
    const result = await this.model.create({
      licencePlate: body.licencePlate,
      amount: body.amount,
    });
    return new LicencePlateResDto(result);
  }

  async edit(body: EditLicencePlateDto): Promise<LicencePlateResDto> {
    const result = await this.model.findByIdAndUpdate(
      new ObjectId(body.id),
      {
        $set: { amount: body.amount },
      },
      { new: true },
    );
    return new LicencePlateResDto(result);
  }

  async remove(id: string): Promise<void> {
    await this.model.findByIdAndDelete(new ObjectId(id));
  }

  async getAll(): Promise<LicencePlateResDto[]> {
    const data = await this.model.find();
    return data.map((x) => new LicencePlateResDto(x));
  }

  async findByLicencePlate(licencePlate: string): Promise<LicencePlate> {
    return this.model.findOne({ licencePlate });
  }

  async decAmount(id: ObjectId, amount: number) {
    return await this.model.findByIdAndUpdate(id, {
      $inc: { amount: -amount },
    });
  }
}
