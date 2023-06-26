import { TestBed } from '@angular/core/testing';

import { SharedUtilValidatorTelefonNummerService } from './shared-util-validator-telefon-nummer.service';

describe('SharedUtilValidatorTelefonNummerService', () => {
  let service: SharedUtilValidatorTelefonNummerService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SharedUtilValidatorTelefonNummerService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
