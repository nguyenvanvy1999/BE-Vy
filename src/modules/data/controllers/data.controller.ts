import { Body, Get, Post, Query, UploadedFile, UseInterceptors } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ApiBody, ApiConsumes } from '@nestjs/swagger';

import { CloudinaryService } from '../../cloudinary/services';
import { HttpApiError } from '../../utils/error/error.decorator';
import { HttpControllerInit } from '../../utils/init';
import { PaginationService } from '../../utils/pagination/service/pagination.service';
import { HttpApiRequest } from '../../utils/request/request.decorator';
import { HttpApiResponse, HttpApiResponsePaging } from '../../utils/response/response.decorator';
import type { IResponsePaging } from '../../utils/response/response.interface';
import { CreateDataDTO, DataListReqDTO, DataResDTO, PaymentBodyDTO } from '../dtos';
import { FileNotAcceptedException } from '../exceptions';
import { DataService } from '../services/data.service';

@HttpControllerInit('Data APIs', 'data', '1')
export class DataController {
  constructor(
    private readonly dataService: DataService,
    private readonly cloudinaryService: CloudinaryService,
    private readonly paginationService: PaginationService,
  ) {}

  @HttpApiRequest('Create vehicle in')
  @HttpApiResponse('data.create', DataResDTO)
  @HttpApiError()
  @UseInterceptors(
    FileInterceptor('file', {
      fileFilter: (_req, file, callback) => {
        const IMAGE_MIME_TYPE = ['image/png', 'image/jpeg'];

        if (!IMAGE_MIME_TYPE.includes(file.mimetype)) {
          return callback(new FileNotAcceptedException(), false);
        }

        return callback(null, true);
      },
      limits: {
        fileSize: 10 * 1024 * 1024,
      },
    }),
  )
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      required: ['file'],
      properties: {
        file: {
          type: 'string',
          format: 'binary',
        },
        sheetIndex: {
          type: 'number',
          default: 0,
        },
      },
    },
  })
  @Post('in')
  public async vehicleIn(@Body() data: CreateDataDTO, @UploadedFile() file: Express.Multer.File): Promise<DataResDTO> {
    const upload = await this.cloudinaryService.uploadImage(file);

    return this.dataService.createInData(data, upload.secure_url as string);
  }

  @HttpApiRequest('Create vehicle in')
  @HttpApiResponse('data.create', DataResDTO)
  @HttpApiError()
  @UseInterceptors(
    FileInterceptor('file', {
      fileFilter: (_req, file, callback) => {
        const IMAGE_MIME_TYPE = ['image/png', 'image/jpeg'];

        if (!IMAGE_MIME_TYPE.includes(file.mimetype)) {
          return callback(new FileNotAcceptedException(), false);
        }

        return callback(null, true);
      },
      limits: {
        fileSize: 10 * 1024 * 1024,
      },
    }),
  )
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      required: ['file'],
      properties: {
        file: {
          type: 'string',
          format: 'binary',
        },
        sheetIndex: {
          type: 'number',
          default: 0,
        },
      },
    },
  })
  @Post('out')
  public async vehicleOut(@Body() data: CreateDataDTO, @UploadedFile() file: Express.Multer.File): Promise<DataResDTO> {
    const upload = await this.cloudinaryService.uploadImage(file);

    return this.dataService.updateOutData(data, upload.secure_url as string);
  }

  @HttpApiRequest('Get list data')
  @HttpApiResponsePaging('data.get', DataResDTO)
  @HttpApiError()
  @Get()
  public async getListData(
    @Query() { page, perPage, sort, search, availableSort, availableSearch }: DataListReqDTO,
  ): Promise<IResponsePaging> {
    const skip: number = this.paginationService.skip(page, perPage);

    let find = {};

    if (search) {
      find = {
        vehicleCode: {
          $regex: new RegExp(search),
          $options: 'i',
        },
      };
    }

    const data = await this.dataService.getListData(find, { limit: perPage, skip, sort });
    const totalData: number = await this.dataService.countData(find);
    const totalPage: number = this.paginationService.totalPage(totalData, perPage);

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

  @HttpApiRequest('Payment')
  @HttpApiResponse('data.payment', DataResDTO)
  @HttpApiError()
  @Post('payment')
  public async payment(@Body() data: PaymentBodyDTO): Promise<DataResDTO> {
    return this.dataService.updatePayment(data.id);
  }
}
