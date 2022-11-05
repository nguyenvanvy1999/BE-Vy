import { Injectable } from '@nestjs/common';
import type { TypeOfObj } from '@src/types';

@Injectable()
export class HelperObjectService {
  public isObject(item: any): item is TypeOfObj {
    return item && typeof item === 'object' && !Array.isArray(item);
  }

  public unique<T>(arr: T[], byKey?: keyof T): T[] {
    if (byKey === undefined) {
      return [...new Set(arr)];
    }

    return [...new Map(arr.map((item) => [item[byKey], item])).values()];
  }
}
