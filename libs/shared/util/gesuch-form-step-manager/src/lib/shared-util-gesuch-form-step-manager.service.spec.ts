import { TestBed } from '@angular/core/testing';

import { SharedModelCompiletimeConfig } from '@dv/shared/model/config';
import { SharedUtilGesuchFormStepManagerService } from './shared-util-gesuch-form-step-manager.service';

describe('SharedUtilGesuchFormStepManagerService', () => {
  let service: SharedUtilGesuchFormStepManagerService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        {
          provide: SharedModelCompiletimeConfig,
          useFactory: () =>
            new SharedModelCompiletimeConfig({
              appType: 'gesuch-app',
              authClientId: 'stip-gesuch-app',
            }),
        },
      ],
    });
    service = TestBed.inject(SharedUtilGesuchFormStepManagerService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
