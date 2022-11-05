import type { ELoggerAction } from './logger.constant';

export interface ILogger {
  action: ELoggerAction;
  description: string;
  apiKey?: string;
  user?: string;
  tags?: string[];
}
