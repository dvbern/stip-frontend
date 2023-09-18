import { TestBed } from '@angular/core/testing';

import { SharedUtilGesuchFormStepManagerService } from './shared-util-gesuch-form-step-manager.service';

describe('SharedUtilGesuchFormStepManagerService', () => {
  let service: SharedUtilGesuchFormStepManagerService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SharedUtilGesuchFormStepManagerService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
