import { TestBed } from '@angular/core/testing';

import { GesuchAppUtilGesuchFormStepManagerService } from './shared-util-gesuch-form-step-manager.service';

describe('GesuchAppUtilGesuchFormStepManagerService', () => {
  let service: GesuchAppUtilGesuchFormStepManagerService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(GesuchAppUtilGesuchFormStepManagerService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
