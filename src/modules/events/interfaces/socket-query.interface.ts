import { ParsedQuery } from 'query-string';

export interface ISocketQuery extends ParsedQuery {
  token: string;
  EIO: string;
  t: string;
  transport: string;
  version?: string;
  deviceId?: string;
}
