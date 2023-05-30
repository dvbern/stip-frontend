import { inject, Injectable } from '@angular/core';
import {
  NgbDateAdapter,
  NgbDateParserFormatter,
  NgbDatepickerI18n,
  NgbDateStruct,
} from '@ng-bootstrap/ng-bootstrap';
import { TranslateService } from '@ngx-translate/core';

@Injectable()
export class SharedPatternNgbDatepickerI18nNgxTranslateAdapter
  implements NgbDatepickerI18n
{
  translateService = inject(TranslateService);

  getWeekdayLabel(weekday: number): string {
    return this.translateService.instant(
      `shared.datepicker.weekday.${weekday}`
    );
  }

  getWeekLabel(): string {
    return this.translateService.instant('shared.datepicker.week');
  }

  getMonthShortName(month: number): string {
    return this.translateService.instant(`shared.datepicker.month.${month}`);
  }

  getMonthFullName(month: number): string {
    return this.getMonthShortName(month);
  }

  getDayAriaLabel(date: NgbDateStruct): string {
    return `${date.day}.${date.month}.${date.year}`;
  }

  getDayNumerals(date: NgbDateStruct): string {
    return date.day.toString();
  }

  getMonthLabel(date: NgbDateStruct): string {
    return this.getMonthFullName(date.month);
  }

  getWeekNumerals(weekNumber: number): string {
    return weekNumber.toString();
  }

  getYearNumerals(year: number): string {
    return year.toString();
  }
}

// TODO this might need to be adjusted based on final DV date format
// handles DV backend date format (for NGB datepicker)
@Injectable()
export class SharedPatternNgbDatepickerDateAdapter
  implements NgbDateAdapter<string>
{
  fromModel(value: string | null): NgbDateStruct | null {
    if (!value) {
      return null;
    } else {
      // we assume that model we received from backend is always correct
      const [year, month, day] = value
        .split('-')
        .map((token) => parseInt(token, 10));
      return { year, month, day };
    }
  }

  toModel(date: NgbDateStruct | null): string | null {
    return date
      ? `${date.year}-${padStart(date.month)}-${padStart(date.day)}`
      : null;
  }
}

// UI input date format
@Injectable()
export class SharedPatternNgbDatepickerParserFormatter
  implements NgbDateParserFormatter
{
  format(date: NgbDateStruct | null): string {
    return date
      ? `${padStart(date.day)}.${padStart(date.month)}.${date.year}`
      : '';
  }

  parse(value: string): NgbDateStruct | null {
    const [day, month, year] = value.split(/\.| |-|_|\//g);
    if (day !== undefined && month !== undefined && year !== undefined) {
      return value ? { year: +year, month: +month, day: +day } : null;
    } else {
      return null;
    }
  }
}

export function provideSharedPatternNgbDatepickerAdapter() {
  return [
    {
      provide: NgbDatepickerI18n,
      useClass: SharedPatternNgbDatepickerI18nNgxTranslateAdapter,
    },
    {
      provide: NgbDateAdapter,
      useClass: SharedPatternNgbDatepickerDateAdapter,
    },
    {
      provide: NgbDateParserFormatter,
      useClass: SharedPatternNgbDatepickerParserFormatter,
    },
  ];
}

export function padStart(value: string | number, length = 2): string {
  return value.toString().padStart(length, '0');
}
