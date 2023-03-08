import {
  Body,
  Get,
  UseGuards,
  Patch,
  Query,
  Post,
  Delete,
} from '@nestjs/common';
import { HttpControllerInit } from '@src/modules/utils/init';
import { HttpApiResponse } from '@src/modules/utils/response/response.decorator';
import { ApiBearerAuth } from '@nestjs/swagger';
import { LicencePlateService } from './licence-plate.service';
import { Roles } from '../auth/decorators';
import { FirebaseGuard } from '../auth/guards';
import { EUserType } from '../user/constants';
import { EditLicencePlateDto } from './dtos/edit.dto';
import { AddLicencePlateDto } from './dtos/add.dto';
import { LicencePlateResDto } from './dtos/res.dto';

@HttpControllerInit('Licence plate', 'admin/licence-plate', '1')
@ApiBearerAuth()
@UseGuards(FirebaseGuard)
@Roles(EUserType.ADMIN)
export class LicencePlateController {
  constructor(private readonly service: LicencePlateService) {}

  @Patch('/update')
  @HttpApiResponse('http.success.ok', LicencePlateResDto)
  public update(
    @Body() body: EditLicencePlateDto,
  ): Promise<LicencePlateResDto> {
    return this.service.edit(body);
  }

  @Get('/search')
  @HttpApiResponse('http.success.ok', LicencePlateResDto)
  public search(): Promise<LicencePlateResDto[]> {
    return this.service.getAll();
  }

  @Post('/create')
  @HttpApiResponse('http.success.ok', LicencePlateResDto)
  public create(@Body() body: AddLicencePlateDto): Promise<LicencePlateResDto> {
    return this.service.add(body);
  }

  @Delete()
  @HttpApiResponse('http.success.ok')
  public remove(@Query('id') id: string): Promise<void> {
    return this.service.remove(id);
  }
}
