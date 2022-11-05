import { ApiException } from '@nanogiants/nestjs-swagger-api-exception-decorator';
import { Body, Get, InternalServerErrorException, Put, Query } from '@nestjs/common';
import { DebuggerService } from '@src/modules/debugger/services/debugger.service';
import { SettingResDTO, SettingUpdateReqDTO, SettingUpdateResDTO } from '@src/modules/setting/dtos';
import { SettingNotFoundException } from '@src/modules/setting/exceptions';
import { EStatusCodeError } from '@src/modules/utils/error/error.constant';
import { HttpApiError } from '@src/modules/utils/error/error.decorator';
import { ErrorExceptionDTO } from '@src/modules/utils/error/error.interface';
import { HttpControllerInit } from '@src/modules/utils/init';
import { PaginationService } from '@src/modules/utils/pagination/service/pagination.service';
import { ParamMongoId } from '@src/modules/utils/pipes';
import { HttpApiRequest } from '@src/modules/utils/request/request.decorator';
import { HttpApiResponse, HttpApiResponsePaging } from '@src/modules/utils/response/response.decorator';
import type { IResponse, IResponsePaging } from '@src/modules/utils/response/response.interface';

import { SettingListReqDTO } from '../dtos/setting.list.dto';
import type { SettingDocument } from '../schemas/setting.schema';
import { SettingService } from '../services/setting.service';

@HttpControllerInit('Setting Admin APIs', 'setting', '1')
export class SettingAdminController {
  constructor(
    private readonly debuggerService: DebuggerService,
    private readonly settingService: SettingService,
    private readonly paginationService: PaginationService,
  ) {}

  @Get('/list')
  @HttpApiRequest('Get list of setting', 'Get list of setting, you can use query params to filter and sort')
  @HttpApiResponsePaging('setting.list', SettingResDTO)
  @HttpApiError()
  async list(
    @Query()
    { page, perPage, sort, search, availableSort, availableSearch }: SettingListReqDTO,
  ): Promise<IResponsePaging> {
    const skip: number = this.paginationService.skip(page, perPage);
    const find: Record<string, any> = {};

    if (search) {
      find.$or = [
        {
          name: {
            $regex: new RegExp(search),
            $options: 'i',
          },
        },
      ];
    }

    const settings: SettingDocument[] = await this.settingService.findAll(find, {
      limit: perPage,
      skip,
      sort,
    });
    const totalData: number = await this.settingService.getTotal(find);
    const totalPage: number = this.paginationService.totalPage(totalData, perPage);

    const data: SettingResDTO[] = this.settingService.serializationList(settings);

    return {
      totalData,
      totalPage,
      currentPage: page,
      perPage,
      availableSearch,
      availableSort,
      data,
    };
  }

  @HttpApiRequest('Get setting', 'Get setting by id')
  @HttpApiResponse('setting.get', SettingResDTO)
  @HttpApiError([
    ApiException(() => SettingNotFoundException, { description: 'Setting not found', type: () => ErrorExceptionDTO }),
  ])
  @Get('get/:setting')
  async get(@ParamMongoId('setting') _id: string): Promise<IResponse> {
    await this.settingService.checkSettingExistById(_id);
    const setting: SettingDocument = await this.settingService.findOneById(_id);

    return this.settingService.serializationGet(setting);
  }

  @HttpApiRequest('Update setting', 'Update setting')
  @HttpApiResponse('setting.update', SettingUpdateResDTO)
  @HttpApiError([
    ApiException(() => SettingNotFoundException, { description: 'Setting not found', type: () => ErrorExceptionDTO }),
  ])
  @Put('/update/:setting')
  async update(
    @ParamMongoId('setting') _id: string,
    @Body()
    body: SettingUpdateReqDTO,
  ): Promise<IResponse> {
    await this.settingService.checkSettingExistById(_id);

    try {
      await this.settingService.updateOneById(_id, body);
    } catch (error: any) {
      this.debuggerService.error('update try catch', 'SettingController', 'update', error);

      throw new InternalServerErrorException({
        statusCode: EStatusCodeError.UNKNOWN_ERROR,
        message: 'http.serverError.internalServerError',
      });
    }

    return {
      _id,
    };
  }
}
