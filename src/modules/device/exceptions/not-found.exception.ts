import { NotFoundException } from '@nestjs/common';
import { EDeviceStatusCodeError } from '@src/modules/device/device.constant';

export class DeviceNotFoundException extends NotFoundException {
  constructor() {
    super({ message: 'device.error.notFound', statusCode: EDeviceStatusCodeError.DEVICE_NOT_FOUND_ERROR });
  }
}
