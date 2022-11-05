export enum EHelperDateFormat {
  DATE = 'YYYY-MM-DD',
  FRIENDLY_DATE = 'MMM, DD YYYY',
  FRIENDLY_DATE_TIME = 'MMM, DD YYYY HH:MM:SS',
  YEAR_MONTH = 'YYYY-MM',
  MONTH_DATE = 'MM-DD',
  ONLY_YEAR = 'YYYY',
  ONLY_MONTH = 'MM',
  ONLY_DATE = 'DD',
  ISO_DATE = 'YYYY-MM-DDTHH:MM:SSZ',
}

export interface IHelperDateFormatOptions {
  timezone?: string;
  format?: EHelperDateFormat | string;
}

export enum EHelperDateDiff {
  MILIS = 'milis',
  SECONDS = 'seconds',
  HOURS = 'hours',
  DAYS = 'days',
  MINUTES = 'minutes',
}
