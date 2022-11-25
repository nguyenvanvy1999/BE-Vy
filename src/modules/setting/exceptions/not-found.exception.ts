import { NotFoundException } from '@nestjs/common';

export class SettingNotFoundException extends NotFoundException {
  constructor() {
    super({
      statusCode: 1,
      message: 'setting.error.notFound',
    });
  }
}
