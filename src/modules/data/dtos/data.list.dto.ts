import { ApiProperty } from '@nestjs/swagger';
import type { PaginationListAbstract } from '@src/modules/utils/pagination/pagination.abstract';
import {
  PaginationAvailableSearch,
  PaginationAvailableSort,
  PaginationPage,
  PaginationPerPage,
  PaginationSearch,
  PaginationSort,
} from '@src/modules/utils/pagination/pagination.decorator';
import { IPaginationSort } from '@src/modules/utils/pagination/pagination.interface';
import { Type } from 'class-transformer';
import { IsBoolean, IsOptional } from 'class-validator';

import {
  DATA_DEFAULT_AVAILABLE_SEARCH,
  DATA_DEFAULT_AVAILABLE_SORT,
  DATA_DEFAULT_PAGE,
  DATA_DEFAULT_PER_PAGE,
  DATA_DEFAULT_SORT,
} from '../data.constants';
import { DateType, VehicleStatus } from './status.dto';

export class DataListReqDTO implements PaginationListAbstract {
  @PaginationSearch()
  readonly search: string;

  @PaginationAvailableSearch(DATA_DEFAULT_AVAILABLE_SEARCH)
  readonly availableSearch: string[];

  @PaginationPage(DATA_DEFAULT_PAGE)
  readonly page: number;

  @PaginationPerPage(DATA_DEFAULT_PER_PAGE)
  readonly perPage: number;

  @PaginationSort(DATA_DEFAULT_SORT, DATA_DEFAULT_AVAILABLE_SORT)
  readonly sort: IPaginationSort;

  @PaginationAvailableSort(DATA_DEFAULT_AVAILABLE_SORT)
  readonly availableSort: string[];

  @ApiProperty()
  @IsOptional()
  readonly status?: VehicleStatus;

  @ApiProperty()
  @IsOptional()
  readonly dateType?: DateType;

  @ApiProperty()
  @IsOptional()
  readonly timeStart?: Date;

  @ApiProperty()
  @IsOptional()
  readonly timeEnd?: Date;

  @ApiProperty()
  @IsOptional()
  @IsBoolean()
  @Type(() => Boolean)
  readonly isPayment?: boolean;
}
