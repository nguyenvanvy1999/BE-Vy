/* eslint-disable @typescript-eslint/ban-types */
/* eslint-disable @typescript-eslint/no-explicit-any */
export type Constructor<T, Arguments extends unknown[] = undefined[]> = new (...arguments_: Arguments) => T;

export type Plain<T> = T;
export type Optional<T> = T | undefined;
export type Nullable<T> = T | null;

export type PathImpl<T, Key extends keyof T> = Key extends string
  ? T[Key] extends TypeOfObj
    ?
        | `${Key}.${PathImpl<T[Key], Exclude<keyof T[Key], keyof any[]>> & string}`
        | `${Key}.${Exclude<keyof T[Key], keyof any[]> & string}`
    : never
  : never;

export type PathImpl2<T> = PathImpl<T, keyof T> | keyof T;

export type Path<T> = keyof T extends string ? (PathImpl2<T> extends string | keyof T ? PathImpl2<T> : keyof T) : never;

export type PathValue<T, P extends Path<T>> = P extends `${infer Key}.${infer Rest}`
  ? Key extends keyof T
    ? Rest extends Path<T[Key]>
      ? PathValue<T[Key], Rest>
      : never
    : never
  : P extends keyof T
  ? T[P]
  : never;

export type KeyOfType<Entity, U> = {
  [P in keyof Required<Entity>]: Required<Entity>[P] extends U ? P : Required<Entity>[P] extends U[] ? P : never;
}[keyof Entity];

export type RequireOnlyOne<T, Keys extends keyof T = keyof T> = Pick<T, Exclude<keyof T, Keys>> &
  {
    [K in Keys]-?: Required<Pick<T, K>> & Partial<Record<Exclude<Keys, K>, undefined>>;
  }[Keys];

export type JsonValue = string | number | boolean;

export interface IJsonObject {
  [k: string]: JsonValue | JsonValue[] | IJsonObject;
}

export type TypeOfObj = Record<string, any>;

export type ApplyDecorator = <TFunction extends Function, Y>(
  target: object | TFunction,
  propertyKey?: string | symbol,
  descriptor?: TypedPropertyDescriptor<Y>,
) => void;

export type RequireAtLeastOne<T, Keys extends keyof T = keyof T> = Pick<T, Exclude<keyof T, Keys>> &
  {
    [K in Keys]-?: Required<Pick<T, K>> & Partial<Pick<T, Exclude<Keys, K>>>;
  }[Keys];
