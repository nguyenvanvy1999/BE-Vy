import type { Request } from 'express';
import type { IResult } from 'ua-parser-js';

export interface IRequestApp extends Request {
  userAgent: IResult;
}
