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

import {
  SETTING_DEFAULT_AVAILABLE_SEARCH,
  SETTING_DEFAULT_AVAILABLE_SORT,
  SETTING_DEFAULT_PAGE,
  SETTING_DEFAULT_PER_PAGE,
  SETTING_DEFAULT_SORT,
} from '../setting.constant';

export class SettingListReqDTO implements PaginationListAbstract {
  @PaginationSearch()
  @ApiProperty({
    type: String,
    required: false,
    nullable: true,
    description: 'Search key',
    example: 'searchKey',
  })
  readonly search?: string;

  @PaginationAvailableSearch(SETTING_DEFAULT_AVAILABLE_SEARCH)
  @ApiProperty({
    type: [String],
    required: true,
    nullable: false,
    description: 'Available search keys',
    example: ['name'],
    enum: ['name'],
    isArray: true,
    readOnly: true,
  })
  readonly availableSearch: string[];

  @PaginationPage(SETTING_DEFAULT_PAGE)
  @ApiProperty({
    type: Number,
    required: true,
    nullable: false,
    description: 'Page number',
    example: 1,
  })
  readonly page: number;

  @PaginationPerPage(SETTING_DEFAULT_PER_PAGE)
  @ApiProperty({
    type: Number,
    required: true,
    nullable: false,
    description: 'Per page',
    example: 10,
  })
  readonly perPage: number;

  @PaginationSort(SETTING_DEFAULT_SORT, SETTING_DEFAULT_AVAILABLE_SORT)
  @ApiProperty({
    description: 'Sort',
    example: 'name@desc',
    nullable: false,
    required: true,
    type: String,
    enum: ['name@asc', 'name@desc', 'createdAt@desc', 'createdAt@asc'],
    default: 'name@asc',
  })
  readonly sort: IPaginationSort;

  @PaginationAvailableSort(SETTING_DEFAULT_AVAILABLE_SORT)
  @ApiProperty({
    type: [String],
    description: 'Available sort keys',
    example: ['createdAt', 'name'],
    required: true,
    nullable: false,
    enum: ['createdAt', 'name'],
    isArray: true,
    readOnly: true,
  })
  readonly availableSort: string[];
}
