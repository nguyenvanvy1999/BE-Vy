import {
  Body,
  Get,
  Param,
  Post,
  Query,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ApiBearerAuth, ApiBody, ApiConsumes } from '@nestjs/swagger';
import { FirebaseGuard } from '../../auth/guards';
import { CloudinaryService } from '../../cloudinary/services';
import { HttpApiError } from '../../utils/error/error.decorator';
import { isNotNullAndUndefined } from '../../utils/functions';
import { HttpControllerInit } from '../../utils/init';
import { PaginationService } from '../../utils/pagination/service/pagination.service';
import { HttpApiRequest } from '../../utils/request/request.decorator';
import {
  HttpApiResponse,
  HttpApiResponsePaging,
} from '../../utils/response/response.decorator';
import {
  CreateDataDTO,
  DataDetailParamDto,
  DataListReqDTO,
  DataResDTO,
  GetProfitQueryDto,
  PaymentBodyDTO,
} from '../dtos';
import { DateType, VehicleStatus } from '../dtos/status.dto';
import {
  DataExistsException,
  DataNotFoundException,
  FileNotAcceptedException,
} from '../exceptions';
import { DataService } from '../services/data.service';
const IMAGE_MIME_TYPE = ['image/png', 'image/jpeg', 'image/jpg'];

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
  public async vehicleIn(
    @Body() data: CreateDataDTO,
    @UploadedFile() file: Express.Multer.File,
  ): Promise<DataResDTO> {
    const exist = await this.dataService.existsByCode(data.vehicleCode);
    if (exist) {
      throw new DataExistsException();
    }
    const upload = await this.cloudinaryService.uploadImage(file);

    return this.dataService.createInData(data, upload.secure_url as string);
  }

  @HttpApiRequest('Create vehicle out')
  @HttpApiResponse('data.create', DataResDTO)
  @HttpApiError()
  @UseInterceptors(
    FileInterceptor('file', {
      fileFilter: (_req, file, callback) => {
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
  public async vehicleOut(
    @Body() data: CreateDataDTO,
    @UploadedFile() file: Express.Multer.File,
  ): Promise<DataResDTO> {
    const exist = await this.dataService.existsByCode(data.vehicleCode);
    if (!exist) {
      throw new DataNotFoundException();
    }
    const upload = await this.cloudinaryService.uploadImage(file);

    return await this.dataService.updateOutData(
      data,
      upload.secure_url as string,
    );
  }

  @UseGuards(FirebaseGuard)
  @HttpApiRequest('Get list data')
  @HttpApiResponsePaging('data.get', DataResDTO)
  @HttpApiError()
  @Get('search')
  @ApiBearerAuth()
  public async getListData(
    @Query()
    { search, status, timeEnd, timeStart, dateType, isPayment }: DataListReqDTO,
  ): Promise<any> {
    const conditions = [];
    if (search) {
      conditions.push({ vehicleCode: { $regex: new RegExp(search, 'i') } });
    }
    if (status && status !== VehicleStatus.ALL) {
      conditions.push({
        timeOut: status === VehicleStatus.PENDING ? null : { $ne: null },
      });
    }
    if (timeStart && dateType) {
      conditions.push(
        dateType === DateType.IN
          ? { timeIn: { $gte: new Date(timeStart) } }
          : { timeOut: { $gte: new Date(timeStart) } },
      );
      if (timeEnd) {
        conditions.push(
          dateType === DateType.IN
            ? { timeIn: { $lte: new Date(timeEnd) } }
            : { timeOut: { $lte: new Date(timeEnd) } },
        );
      } else {
        conditions.push(
          dateType === DateType.IN
            ? { timeIn: { $lte: new Date() } }
            : { timeOut: { $lte: new Date() } },
        );
      }
    }
    if (isNotNullAndUndefined(isPayment) && isPayment === true) {
      conditions.push({ paymentAt: { $ne: null } });
    }
    const find = conditions.length ? { $and: conditions } : {};
    const data = await this.dataService.getListData(find, {
      sort: { createdAt: -1 },
      limit: 10000,
      skip: 0,
    });
    return { data };
  }

  @ApiBearerAuth()
  @UseGuards(FirebaseGuard)
  @HttpApiRequest('Get profit by time')
  @HttpApiResponse('data.get')
  @HttpApiError()
  @Get('profit')
  public getProfit(@Query() query: GetProfitQueryDto): Promise<number> {
    return this.dataService.getProfit(query);
  }

  @HttpApiRequest('Get data detail')
  @HttpApiResponse('data.get', DataResDTO)
  @HttpApiError()
  @Get(':id')
  public getDetail(@Param() param: DataDetailParamDto): Promise<DataResDTO> {
    return this.dataService.getDetail(param.id);
  }

  @ApiBearerAuth()
  @ApiBearerAuth()
  @UseGuards(FirebaseGuard)
  @HttpApiRequest('Payment')
  @HttpApiResponse('data.payment', DataResDTO)
  @HttpApiError()
  @Post('payment')
  public async payment(@Body() data: PaymentBodyDTO): Promise<DataResDTO> {
    return this.dataService.updatePayment(data.id);
  }
  @ApiBearerAuth()
  @UseGuards(FirebaseGuard)
  @HttpApiRequest('Get chart data for vehicle count')
  @HttpApiResponse('data.get', DataResDTO)
  @HttpApiError()
  @Get('chart/vehicle')
  public async countVehicle(
    @Query('startDate') startDate: string,
    @Query('endDate') endDate: string,
  ): Promise<any> {
    return this.dataService.countVehicle(startDate, endDate);
  }
  @ApiBearerAuth()
  @UseGuards(FirebaseGuard)
  @HttpApiRequest('Get chart data for profit')
  @HttpApiResponse('data.get')
  @HttpApiError()
  @Get('chart/profit')
  public async countProfit(
    @Query('startDate') startDate: string,
    @Query('endDate') endDate: string,
  ): Promise<any> {
    return this.dataService.countProfit(startDate, endDate);
  }
}
