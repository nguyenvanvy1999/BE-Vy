import type { RequireOnlyOne } from '@src/types';

export type IGetEnvOptions<T> = RequireOnlyOne<
  { defaultValue: T; throwError: true | Error },
  'defaultValue' | 'throwError'
>;
