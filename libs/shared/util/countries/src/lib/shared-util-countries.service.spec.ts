import { TestBed } from '@angular/core/testing';

import { SharedUtilCountriesService } from './shared-util-countries.service';

describe('SharedUtilCountriesService', () => {
  let service: SharedUtilCountriesService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SharedUtilCountriesService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
