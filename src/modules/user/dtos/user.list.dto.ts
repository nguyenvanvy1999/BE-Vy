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
  USER_DEFAULT_AVAILABLE_SEARCH,
  USER_DEFAULT_AVAILABLE_SORT,
  USER_DEFAULT_PAGE,
  USER_DEFAULT_PER_PAGE,
  USER_DEFAULT_SORT,
} from '../user.constant';

export class UserListReqDTO implements PaginationListAbstract {
  @PaginationSearch()
  readonly search: string;

  @PaginationAvailableSearch(USER_DEFAULT_AVAILABLE_SEARCH)
  readonly availableSearch: string[];

  @PaginationPage(USER_DEFAULT_PAGE)
  readonly page: number;

  @PaginationPerPage(USER_DEFAULT_PER_PAGE)
  readonly perPage: number;

  @PaginationSort(USER_DEFAULT_SORT, USER_DEFAULT_AVAILABLE_SORT)
  readonly sort: IPaginationSort;

  @PaginationAvailableSort(USER_DEFAULT_AVAILABLE_SORT)
  readonly availableSort: string[];
}
