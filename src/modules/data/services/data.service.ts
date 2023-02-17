import { Injectable } from '@nestjs/common';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { ObjectId } from 'mongodb';
import type { FilterQuery } from 'mongoose';
import { EEventType } from '../../gateway/dtos/event-type.enum';
import dayjs, { Dayjs } from 'dayjs';
import type { IDatabaseFindAllOptions } from '../../utils/database';
import { DataCollection } from '../collections';
import type { CreateDataDTO, GetProfitQueryDto } from '../dtos';
import { DataResDTO } from '../dtos';
import { DataNotFoundException } from '../exceptions';
import type { DataDocument } from '../schemas/data.schema';

@Injectable()
export class DataService {
  constructor(
    private readonly dataCollection: DataCollection,
    private readonly eventEmitter: EventEmitter2,
  ) {}

  public async createInData(
    data: CreateDataDTO,
    image: string,
  ): Promise<DataResDTO> {
    const res = await this.dataCollection.createInData(data, image);
    const newData = new DataResDTO(res);
    this.eventEmitter.emit(EEventType.IN, newData);
    return newData;
  }

  public async updateOutData(
    data: CreateDataDTO,
    image: string,
  ): Promise<DataResDTO> {
    const res = await this.dataCollection.updateOutData(data, image);
    const newData = new DataResDTO(res);
    this.eventEmitter.emit(EEventType.OUT, newData);
    return newData;
  }

  public async getListData(
    filter?: FilterQuery<DataDocument>,
    options?: IDatabaseFindAllOptions,
  ): Promise<DataResDTO[]> {
    const data = await this.dataCollection.findAll(filter, options);

    return data.map((x) => new DataResDTO(x));
  }

  public countData(filter?: FilterQuery<DataDocument>): Promise<number> {
    return this.dataCollection.count(filter);
  }

  public async updatePayment(id: string): Promise<DataResDTO> {
    const res = await this.dataCollection.updatePayment(new ObjectId(id));
    if (!res) {
      throw new DataNotFoundException();
    }
    const newData = new DataResDTO(res);
    this.eventEmitter.emit(EEventType.PAYMENT, newData);
    return newData;
  }

  public existsByCode(vehicleCode: string): Promise<boolean> {
    return this.dataCollection.exists({ vehicleCode });
  }

  public async getDetail(id: string): Promise<DataResDTO> {
    const res = await this.dataCollection.findOneById(new ObjectId(id));
    return new DataResDTO(res);
  }

  public async getProfit(query: GetProfitQueryDto): Promise<number> {
    return this.dataCollection.getProfit({
      $and: [
        { createdAt: { $gte: new Date(query.startTime) } },
        { createdAt: { $lte: new Date(query.endTime) } },
      ],
    });
  }

  getRangeOfDates(start: Dayjs, end: Dayjs, key, arr = [start.startOf(key)]) {
    if (start.isAfter(end)) throw new Error('start must precede end');
    const next = dayjs(start).add(1, key).startOf(key);
    if (next.isAfter(end, key)) return arr;
    return this.getRangeOfDates(next, end, key, arr.concat(next));
  }

  async countVehicle(startDate: string, endDate: string) {
    const vehicleCount: DataDocument[] = await this.dataCollection.aggregate([
      {
        $match: {
          $and: [
            { timeOut: { $gte: new Date(startDate) } },
            { timeOut: { $lt: new Date(endDate) } },
          ],
        },
      },
      { $sort: { timeOut: 1 } },
      {
        $project: {
          _id: 1,
          timeOut: 1,
        },
      },
    ]);

    const group =
      this.getRangeOfDates(dayjs(startDate), dayjs(endDate), 'day')?.map(
        (x) => {
          return {
            day: x?.toISOString(),
            count: vehicleCount.filter((a) => dayjs(a.timeOut).isSame(x, 'day'))
              .length,
          };
        },
      ) || [];

    return group;
  }

  async countProfit(startDate: string, endDate: string) {
    const vehicleCount: DataDocument[] = await this.dataCollection.aggregate([
      {
        $match: {
          $and: [
            { timeOut: { $gte: new Date(startDate) } },
            { timeOut: { $lt: new Date(endDate) } },
          ],
        },
      },
      { $sort: { timeOut: 1 } },
      {
        $project: {
          _id: 1,
          timeOut: 1,
          fee: 1,
        },
      },
    ]);

    const group =
      this.getRangeOfDates(dayjs(startDate), dayjs(endDate), 'day')?.map(
        (x) => {
          return {
            day: x?.toISOString(),
            profit: vehicleCount.reduce((count, value) => {
              if (dayjs(value.timeOut).isSame(x, 'day')) {
                count = count + value.fee;
              }
              return count;
            }, 0),
          };
        },
      ) || [];

    return group;
  }

  public checkAndFormatVehicleCode(vehicleCode: string): string {
    try {
      if (!vehicleCode) {
        return;
      }
      // trim and replace special characters
      const newCode = vehicleCode.replace(/[^a-zA-Z0-9]/g, '').toUpperCase();

      // check length of code
      const VIET_NAM_LICENCE_PLATE_LENGTH = [7, 8];
      if (!VIET_NAM_LICENCE_PLATE_LENGTH.includes(newCode.length)) {
        return;
      }

      // check text character
      const textCharacter = newCode.charAt(2);
      if (!textCharacter.match(/[A-Z]/i)) {
        return;
      }

      // check province code
      const provinceCode = newCode.slice(0, 2);
      if (
        Number.parseInt(provinceCode) < 11 ||
        Number.parseInt(provinceCode) > 99
      ) {
        return;
      }

      // check number
      const code = newCode.slice(3, -1);
      if (Number.parseInt(code) < 1) {
        return;
      }

      // return formatted code
      return newCode.slice(0, 3).concat('-').concat(newCode.slice(3, newCode.length));
    } catch (error) {
      return;
    }
  }
}
