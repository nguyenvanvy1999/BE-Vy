import type { TypeOfObj } from '@src/types';

export type IResponse = TypeOfObj;

export interface IResponsePaging {
  totalData: number;
  totalPage: number;
  currentPage: number;
  perPage: number;
  availableSearch?: string[];
  availableSort: string[];
  data: TypeOfObj[];
}
