import { Injectable } from '@nestjs/common';

import { PAGINATION_DEFAULT_MAX_PAGE, PAGINATION_DEFAULT_MAX_PER_PAGE } from '../pagination.constant';

@Injectable()
export class PaginationService {
  skip(page: number, perPage: number): number {
    page = page > PAGINATION_DEFAULT_MAX_PAGE ? PAGINATION_DEFAULT_MAX_PAGE : page;
    perPage = perPage > PAGINATION_DEFAULT_MAX_PER_PAGE ? PAGINATION_DEFAULT_MAX_PER_PAGE : perPage;

    return (page - 1) * perPage;
  }

  totalPage(totalData: number, limit: number): number {
    return Math.ceil(totalData / limit);
  }
}
