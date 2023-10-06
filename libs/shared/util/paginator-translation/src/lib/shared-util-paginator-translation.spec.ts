import { TestBed } from '@angular/core/testing';
import { TranslateModule } from '@ngx-translate/core';

import { SharedUtilPaginatorTranslation } from './shared-util-paginator-translation';

describe('SharedUtilPaginatorTranslationService', () => {
  let service: SharedUtilPaginatorTranslation;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [TranslateModule.forRoot()],
      providers: [SharedUtilPaginatorTranslation],
    });
    service = TestBed.inject(SharedUtilPaginatorTranslation);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
