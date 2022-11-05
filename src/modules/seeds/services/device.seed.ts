import { faker } from '@faker-js/faker';
import { Injectable, Logger } from '@nestjs/common';
import { DeviceStatus } from '@src/modules/device/dto';
import { DeviceService } from '@src/modules/device/services';
import { Types } from 'mongoose';
import { Command } from 'nestjs-command';

@Injectable()
export class DeviceSeed {
  constructor(private readonly deviceService: DeviceService, private readonly logger: Logger) {}

  @Command({
    command: 'insert:device',
    describe: 'insert devices',
  })
  async insert(): Promise<void> {
    try {
      const devices = await this.deviceService.createManyDevice([
        {
          _id: new Types.ObjectId().toString(),
          deviceName: faker.name.jobTitle(),
          deviceType: 'Camera',
          SN: '900JP-YHVGX-9IA84-GEUJQ-UR0BC',
          deviceMAC: faker.internet.mac(),
          firmwareVersion: '1.1.0',
          IPAddress: faker.internet.ipv4(),
          port: faker.internet.port(),
          description: faker.name.jobDescriptor(),
          status: DeviceStatus.INACTIVE,
        },
        {
          _id: new Types.ObjectId().toString(),
          deviceName: faker.name.jobTitle(),
          deviceType: 'Camera',
          SN: 'MOI0K-5URJX-RKU1P-PG7P5-EOBND',
          deviceMAC: faker.internet.mac(),
          firmwareVersion: '1.1.0',
          IPAddress: faker.internet.ipv4(),
          port: faker.internet.port(),
          description: faker.name.jobDescriptor(),
          status: DeviceStatus.INACTIVE,
        },
      ]);
      this.logger.log(devices);
    } catch (error) {
      this.logger.error(`Insert device error ${JSON.stringify(error)}`);
    }
  }

  @Command({
    command: 'remove:device',
    describe: 'remove devices',
  })
  async remove(): Promise<void> {
    try {
      await this.deviceService.deleteMany({});
    } catch (error) {
      this.logger.error(`Insert device error ${JSON.stringify(error)}`);
    }
  }
}
