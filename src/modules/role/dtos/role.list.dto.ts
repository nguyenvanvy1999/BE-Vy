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
  ROLE_DEFAULT_AVAILABLE_SEARCH,
  ROLE_DEFAULT_AVAILABLE_SORT,
  ROLE_DEFAULT_PAGE,
  ROLE_DEFAULT_PER_PAGE,
  ROLE_DEFAULT_SORT,
} from '../role.constant';

export class RoleListResDTO implements PaginationListAbstract {
  @PaginationSearch()
  @ApiProperty({ type: String, required: false, nullable: true, description: 'Search key', example: 'searchKey' })
  readonly search?: string;

  @PaginationAvailableSearch(ROLE_DEFAULT_AVAILABLE_SEARCH)
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

  @PaginationPage(ROLE_DEFAULT_PAGE)
  @ApiProperty({ type: Number, required: true, nullable: false, description: 'Page number', example: 1 })
  readonly page: number;

  @PaginationPerPage(ROLE_DEFAULT_PER_PAGE)
  @ApiProperty({ type: Number, required: true, nullable: false, description: 'Per page', example: 10 })
  readonly perPage: number;

  @PaginationSort(ROLE_DEFAULT_SORT, ROLE_DEFAULT_AVAILABLE_SORT)
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

  @PaginationAvailableSort(ROLE_DEFAULT_AVAILABLE_SORT)
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
