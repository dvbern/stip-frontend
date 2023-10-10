import { Injectable } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { MatPaginatorIntl } from '@angular/material/paginator';
import { TranslateParser, TranslateService } from '@ngx-translate/core';
import { startWith, switchMap } from 'rxjs';

type TranslatableProperties =
  | keyof Pick<
      SharedUtilPaginatorTranslation,
      | 'itemsPerPageLabel'
      | 'firstPageLabel'
      | 'lastPageLabel'
      | 'nextPageLabel'
      | 'previousPageLabel'
      | 'rangeLabel'
    >;

@Injectable()
export class SharedUtilPaginatorTranslation extends MatPaginatorIntl {
  public rangeLabel?: string;
  private labelMap: Record<TranslatableProperties, string> = {
    itemsPerPageLabel: 'shared.table.paginator.itemsPerPage',
    nextPageLabel: 'shared.table.paginator.nextPage',
    lastPageLabel: 'shared.table.paginator.lastPage',
    previousPageLabel: 'shared.table.paginator.previousPage',
    firstPageLabel: 'shared.table.paginator.firstPage',
    rangeLabel: 'shared.table.paginator.range',
  };

  constructor(
    private translateService: TranslateService,
    private translateParser: TranslateParser
  ) {
    super();

    this.translateService.onLangChange
      .pipe(
        takeUntilDestroyed(),
        startWith({}),
        switchMap(() => this.translateService.get(Object.values(this.labelMap)))
      )
      .subscribe((translation) => {
        Object.entries(this.labelMap).forEach(([key, value]) => {
          this[key as unknown as TranslatableProperties] = translation[value];
        });
        this.changes.next();
      });
  }

  override getRangeLabel = (
    page: number,
    pageSize: number,
    length: number
  ): string => {
    const rangeLabel = this.rangeLabel;
    if (!rangeLabel) {
      return '';
    }
    return (
      this.translateParser.interpolate(rangeLabel, {
        page: page + 1,
        pages: Math.ceil(length / pageSize),
      }) ?? ''
    );
  };
}
