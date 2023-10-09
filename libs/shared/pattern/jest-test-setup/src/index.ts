import { importProvidersFrom } from '@angular/core';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { RouterTestingModule } from '@angular/router/testing';
import { TranslateModule } from '@ngx-translate/core';
import { KeycloakAngularModule } from 'keycloak-angular';

import {
  CompiletimeConfig,
  SharedModelCompiletimeConfig,
} from '@dv/shared/model/config';

export function provideSharedPatternJestTestSetup(
  compileTimeConfig: CompiletimeConfig = {
    appType: 'gesuch-app',
    authClientId: 'stip-gesuch-app',
  }
) {
  return [
    importProvidersFrom([
      RouterTestingModule,
      TranslateModule.forRoot(),
      KeycloakAngularModule,
      NoopAnimationsModule,
    ]),
    {
      provide: SharedModelCompiletimeConfig,
      useFactory: () => new SharedModelCompiletimeConfig(compileTimeConfig),
    },
  ];
}
