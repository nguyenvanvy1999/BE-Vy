import { ApiException } from '@nanogiants/nestjs-swagger-api-exception-decorator';
import { Body, NotFoundException, Post } from '@nestjs/common';
import { CustomConfigService } from '@src/configs/env/services';
import { DeviceNotFoundException } from '@src/modules/device/exceptions';
import { DeviceService } from '@src/modules/device/services';
import { DeviceTokenNotFoundException } from '@src/modules/device-token/exceptions';
import { DeviceTokenService } from '@src/modules/device-token/services';
import { MessageService } from '@src/modules/message/service';
import { EStatusCodeError } from '@src/modules/utils/error/error.constant';
import { HttpApiError } from '@src/modules/utils/error/error.decorator';
import { HelperEncryptionService } from '@src/modules/utils/helper/service/helper.encryption.service';
import { HttpControllerInit } from '@src/modules/utils/init';
import { HttpApiRequest } from '@src/modules/utils/request/request.decorator';
import { HttpApiResponse } from '@src/modules/utils/response/response.decorator';
import type { IResponse } from '@src/modules/utils/response/response.interface';
import { v4 } from 'uuid';

import {
  DeviceActiveReqDTO,
  DeviceActiveResDTO,
  DeviceInactiveResDTO,
  DeviceRefreshTokenReqDTO,
  DeviceStatus,
} from '../dto';

@HttpControllerInit('Device Common APIs', '/', '1')
export class DeviceCommonController {
  constructor(
    private readonly encryptUtil: HelperEncryptionService,
    private readonly messageService: MessageService,
    private readonly configService: CustomConfigService,
    private readonly deviceService: DeviceService,
    private readonly tokenService: DeviceTokenService,
  ) {}

  @Post('/active')
  @HttpApiResponse('device.active', DeviceActiveResDTO, 'Success', 200)
  @HttpApiRequest('Active device', 'Active device with SN and deviceMAC')
  @HttpApiError([ApiException(() => DeviceNotFoundException, { description: 'Device not found' })])
  public async activeDevice(@Body() body: DeviceActiveReqDTO): Promise<IResponse> {
    const { SN, deviceMAC } = body;
    const isDeviceExist = await this.deviceService.findOne({ SN, deviceMAC }, '_id deviceName deviceType');

    if (!isDeviceExist) {
      throw new NotFoundException({ message: 'device.error.notFound', statusCode: EStatusCodeError.UNKNOWN_ERROR });
    }

    const isTokenExist = await this.tokenService.checkExistByDeviceId(isDeviceExist._id);

    const refreshToken = v4();
    const accessToken = this.encryptUtil.jwtEncrypt(isDeviceExist);

    const pr1 = this.deviceService.changeDeviceStatus(isDeviceExist._id, DeviceStatus.ACTIVE);

    const pr2: Promise<any> = isTokenExist
      ? this.tokenService.updateToken(isTokenExist._id, refreshToken)
      : this.tokenService.createToken(isDeviceExist._id, refreshToken, '168.143.181.178');
    await Promise.all([pr1, pr2]);

    return { refreshToken, accessToken };
  }

  @Post('/inactive')
  @HttpApiResponse('device.inactive', DeviceInactiveResDTO)
  @HttpApiRequest('Inactive device', 'Inactive device with SN and deviceMAC')
  @HttpApiError([ApiException(() => DeviceNotFoundException, { description: 'Device not found' })])
  public async inactiveDevice(@Body() body: DeviceActiveReqDTO): Promise<IResponse> {
    const { SN, deviceMAC } = body;
    const isDeviceExist = await this.deviceService.checkExistBySNAndMAC(SN, deviceMAC);

    if (!isDeviceExist) {
      throw new DeviceNotFoundException();
    }

    const pr1 = this.tokenService.deleteTokenByDeviceId(isDeviceExist._id);
    const pr2 = this.deviceService.changeDeviceStatus(isDeviceExist._id, DeviceStatus.INACTIVE);
    await Promise.all([pr1, pr2]);

    return isDeviceExist;
  }

  @Post('/refresh-token')
  @HttpApiResponse('token.refresh', DeviceActiveResDTO)
  @HttpApiRequest('Refresh device access token', 'Refresh device access token with refreshToken')
  @HttpApiError([
    ApiException(() => DeviceNotFoundException, { description: 'Device not found' }),
    ApiException(() => DeviceTokenNotFoundException, { description: 'Device token not found' }),
  ])
  public async refreshToken(@Body() body: DeviceRefreshTokenReqDTO): Promise<IResponse> {
    const { token } = body;
    const isTokenExist = await this.tokenService.findOne({ token }, '_id deviceId');

    if (!isTokenExist) {
      throw new DeviceTokenNotFoundException();
    }

    const device = await this.deviceService.findById(isTokenExist.deviceId, '_id deviceName deviceType');

    if (!device) {
      throw new DeviceNotFoundException();
    }

    const accessToken = this.encryptUtil.jwtEncrypt(device);

    return { refreshToken: token, accessToken };
  }
}
