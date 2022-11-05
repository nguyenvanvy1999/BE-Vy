import { NotFoundException } from '@nestjs/common';
import { EDeviceTokenStatusCodeError } from '@src/modules/device-token/device-token.constant';

export class DeviceTokenNotFoundException extends NotFoundException {
  constructor() {
    super({ statusCode: EDeviceTokenStatusCodeError.DEVICE_TOKEN_NOT_FOUND, message: 'token.error.notFound' });
  }
}
