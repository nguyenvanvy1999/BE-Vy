import type { IJsonObject } from './json-object.interface';

export interface IJwtPayload extends IJsonObject {
  sub: string;
  _id: string;
  deviceName: string;
  iat: number;
}
