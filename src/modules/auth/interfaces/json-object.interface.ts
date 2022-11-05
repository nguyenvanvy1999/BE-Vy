export type JsonValue = string | number | boolean;

export interface IJsonObject {
  [k: string]: JsonValue | JsonValue[] | IJsonObject;
}
