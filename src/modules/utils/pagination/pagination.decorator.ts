import { applyDecorators } from '@nestjs/common';
import { MinGreaterThan, Skip } from '@src/modules/utils/request/validation';
import type { ApplyDecorator, TypeOfObj } from '@src/types';
import { Expose, Transform, Type } from 'class-transformer';
import {
  IsBoolean,
  IsDate,
  IsEnum,
  IsMongoId,
  IsNotEmpty,
  IsOptional,
  ValidateIf,
} from 'class-validator';

import {
  EPaginationAvailableSortType,
  PAGINATION_DEFAULT_AVAILABLE_SORT,
  PAGINATION_DEFAULT_MAX_PAGE,
  PAGINATION_DEFAULT_MAX_PER_PAGE,
  PAGINATION_DEFAULT_PAGE,
  PAGINATION_DEFAULT_PER_PAGE,
  PAGINATION_DEFAULT_SORT,
} from './pagination.constant';
import type {
  IPaginationFilterDateOptions,
  IPaginationFilterOptions,
  IPaginationFilterStringOptions,
} from './pagination.interface';

export function PaginationSearch(): ApplyDecorator {
  return applyDecorators(
    Expose(),
    Transform(({ value }) => (value ? value : undefined), {
      toClassOnly: true,
    }),
  );
}

export function PaginationAvailableSearch(
  availableSearch: string[],
): ApplyDecorator {
  return applyDecorators(
    Expose(),
    Transform(() => availableSearch, {
      toClassOnly: true,
    }),
  );
}

export function PaginationPage(page = PAGINATION_DEFAULT_PAGE): ApplyDecorator {
  return applyDecorators(
    Expose(),
    Transform(
      ({ value }) =>
        !value
          ? page
          : value && Number.isNaN(value)
          ? page
          : Number.parseInt(value, 10) > PAGINATION_DEFAULT_MAX_PAGE
          ? PAGINATION_DEFAULT_MAX_PAGE
          : Number.parseInt(value, 10),
      {
        toClassOnly: true,
      },
    ),
  );
}

export function PaginationPerPage(
  perPage = PAGINATION_DEFAULT_PER_PAGE,
): ApplyDecorator {
  return applyDecorators(
    Expose(),
    Transform(
      ({ value }) =>
        !value
          ? perPage
          : value && Number.isNaN(value)
          ? perPage
          : Number.parseInt(value, 10) > PAGINATION_DEFAULT_MAX_PER_PAGE
          ? PAGINATION_DEFAULT_MAX_PER_PAGE
          : Number.parseInt(value, 10),
      {
        toClassOnly: true,
      },
    ),
  );
}

export function PaginationSort(
  sort = PAGINATION_DEFAULT_SORT,
  availableSort = PAGINATION_DEFAULT_AVAILABLE_SORT,
): ApplyDecorator {
  return applyDecorators(
    Expose(),
    Transform(
      ({ value, obj }) => {
        const bSort = PAGINATION_DEFAULT_SORT.split('@')[0];

        const rSort = value || sort;
        const rAvailableSort = obj._availableSort || availableSort;
        const field: string = rSort.split('@')[0];
        const type: string = rSort.split('@')[1];
        const convertField: string = rAvailableSort.includes(field)
          ? field
          : bSort;
        const convertType: number =
          type === 'desc'
            ? EPaginationAvailableSortType.DESC
            : EPaginationAvailableSortType.ASC;

        return { [convertField]: convertType };
      },
      {
        toClassOnly: true,
      },
    ),
  );
}

export function PaginationAvailableSort(
  availableSort = PAGINATION_DEFAULT_AVAILABLE_SORT,
): ApplyDecorator {
  return applyDecorators(
    Expose(),
    Transform(({ value }) => (!value ? availableSort : value), {
      toClassOnly: true,
    }),
  );
}

export function PaginationFilterBoolean(
  defaultValue: boolean[],
): ApplyDecorator {
  return applyDecorators(
    Expose(),
    IsBoolean({ each: true }),
    Transform(
      ({ value }): boolean[] => {
        if (value) {
          if (Array.isArray(value)) {
            return value.map((val: string) => val === 'true');
          }

          return [value === 'true'];
        }

        return defaultValue;
      },
      {
        toClassOnly: true,
      },
    ),
  );
}

export function PaginationFilterEnum<T>(
  defaultValue: T[],
  defaultEnum: TypeOfObj,
): ApplyDecorator {
  const cEnum = defaultEnum as unknown;

  return applyDecorators(
    Expose(),
    IsEnum(cEnum as TypeOfObj, { each: true }),
    Transform(
      ({ value }) =>
        value
          ? value.split(',').map((val: string) => defaultEnum[val])
          : defaultValue,
      {
        toClassOnly: true,
      },
    ),
  );
}

export function PaginationFilterId(
  field: string,
  options?: IPaginationFilterOptions,
): ApplyDecorator {
  return applyDecorators(
    Expose(),
    IsMongoId(),
    options && options.required ? IsNotEmpty() : Skip(),
    options && options.required
      ? Skip()
      : ValidateIf((e) => e[field] !== '' && e[field]),
  );
}

export function PaginationFilterDate(
  field: string,
  options?: IPaginationFilterDateOptions,
): ApplyDecorator {
  return applyDecorators(
    Expose(),
    IsDate(),
    Type(() => Date),
    options && options.required ? IsNotEmpty() : IsOptional(),
    options && options.required
      ? Skip()
      : options.asEndDate
      ? ValidateIf(
          (e) =>
            e[field] !== '' &&
            e[options.asEndDate.moreThanField] !== '' &&
            e[field] &&
            e[options.asEndDate.moreThanField],
        )
      : ValidateIf((e) => e[field] !== '' && e[field]),
    options && options.asEndDate
      ? MinGreaterThan(options.asEndDate.moreThanField)
      : Skip(),
    options && options.asEndDate
      ? Transform(
          ({ value }) => {
            const result = new Date(value);
            result.setDate(result.getDate() + 1);

            return result;
          },
          {
            toClassOnly: true,
          },
        )
      : Skip(),
  );
}

export function PaginationFilterString(
  field: string,
  options?: IPaginationFilterStringOptions,
): ApplyDecorator {
  return applyDecorators(
    Expose(),
    options && options.lowercase
      ? Transform(
          ({ value }) =>
            value
              ? value.split(',').map((val: string) => val.toLowerCase())
              : undefined,
          {
            toClassOnly: true,
          },
        )
      : Skip(),
    options && options.required ? IsNotEmpty() : IsOptional(),
    options && options.required
      ? Skip()
      : ValidateIf((e) => e[field] !== '' && e[field]),
  );
}
