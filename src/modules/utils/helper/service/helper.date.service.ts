import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import type { EHelperDateDiff, IHelperDateFormatOptions } from '@src/modules/utils/helper/helper.constant';
import { EHelperDateFormat } from '@src/modules/utils/helper/helper.constant';
import dayjs from 'dayjs';
import duration from 'dayjs/plugin/duration';
import timezone from 'dayjs/plugin/timezone';
import utc from 'dayjs/plugin/utc';

dayjs.extend(utc);
dayjs.extend(timezone);
dayjs.extend(duration);

@Injectable()
export class HelperDateService {
  private readonly tz: string;

  constructor(private readonly configService: ConfigService) {
    this.tz = this.configService.get<string>('app.timezone');
  }

  calculateAge(dateOfBirth: Date): number {
    return dayjs().diff(dateOfBirth, 'years');
  }

  diff(dateOne: Date, dateTwo: Date, format?: EHelperDateDiff): number {
    const mDateOne = dayjs(dateOne);
    const mDateTwo = dayjs(dateTwo);
    const diff = dayjs.duration(mDateTwo.diff(mDateOne));

    switch (format) {
      case 'milis': {
        return diff.asMilliseconds();
      }

      case 'seconds': {
        return diff.asSeconds();
      }

      case 'hours': {
        return diff.asHours();
      }

      case 'days': {
        return diff.asDays();
      }
    }

    return diff.asMinutes();
  }

  check(date: string | number): boolean {
    return dayjs(date).isValid();
  }

  create(date?: string | Date | number): Date {
    return dayjs(date).toDate();
  }

  timestamp(date?: string | Date): number {
    return dayjs(date).valueOf();
  }

  format(date: Date, options?: IHelperDateFormatOptions): string {
    return dayjs(date)
      .tz(options && options.timezone ? options.timezone : this.tz)
      .format(options && options.format ? options.format : EHelperDateFormat.DATE);
  }

  forwardInMinutes(minutes: number): Date {
    return dayjs().add(minutes, 'm').toDate();
  }

  backwardInMinutes(minutes: number): Date {
    return dayjs().subtract(minutes, 'm').toDate();
  }

  forwardInDays(days: number): Date {
    return dayjs().add(days, 'd').toDate();
  }

  backwardInDays(days: number): Date {
    return dayjs().subtract(days, 'd').toDate();
  }

  forwardInMonths(months: number): Date {
    return dayjs().add(months, 'M').toDate();
  }

  backwardInMonths(months: number): Date {
    return dayjs().subtract(months, 'M').toDate();
  }
}
