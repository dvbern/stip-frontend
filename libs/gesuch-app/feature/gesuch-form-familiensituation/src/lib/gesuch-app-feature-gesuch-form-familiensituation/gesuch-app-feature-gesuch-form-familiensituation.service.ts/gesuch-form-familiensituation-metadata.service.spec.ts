import { TestBed } from '@angular/core/testing';

import { GesuchFormFamiliensituationMetadataService } from './gesuch-form-familiensituation-metadata.service';

describe('GesuchFormFamiliensituationMetadataService', () => {
  let service: GesuchFormFamiliensituationMetadataService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(GesuchFormFamiliensituationMetadataService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
