import { inject, Injectable } from '@angular/core';
import { AppType, SharedModelCompiletimeConfig } from '@dv/shared/model/config';
import { GesuchFormularUpdate } from '@dv/shared/model/gesuch';

import {
  SharedModelGesuchFormStep,
  isStepDisabled,
  FAMILIENSITUATION,
  PERSON,
  AUSBILDUNG,
  LEBENSLAUF,
  ELTERN,
  GESCHWISTER,
  PARTNER,
  KINDER,
  AUSZAHLUNGEN,
  EINNAHMEN_KOSTEN,
  ABSCHLUSS,
} from '@dv/shared/model/gesuch-form';
import { sharedUtilFnTypeGuardsIsDefined } from '@dv/shared/util-fn/type-guards';

const RETURN_TO_COCKPIT: SharedModelGesuchFormStep = {
  route: '/',
  translationKey: '',
  currentStepNumber: Number.MAX_SAFE_INTEGER,
  iconSymbolName: '',
};

const BaseSteps = [
  PERSON,
  AUSBILDUNG,
  LEBENSLAUF,
  FAMILIENSITUATION,
  ELTERN,
  GESCHWISTER,
  PARTNER,
  KINDER,
  AUSZAHLUNGEN,
  EINNAHMEN_KOSTEN,
];

const StepFlow: Record<AppType, SharedModelGesuchFormStep[]> = {
  'gesuch-app': [...BaseSteps, ABSCHLUSS, RETURN_TO_COCKPIT],
  'sachbearbeitung-app': [...BaseSteps, RETURN_TO_COCKPIT],
};

@Injectable({
  providedIn: 'root',
})
export class SharedUtilGesuchFormStepManagerService {
  private compiletimeConfig = inject(SharedModelCompiletimeConfig);
  getAllSteps(gesuchFormular: GesuchFormularUpdate | null) {
    const steps: Record<AppType, SharedModelGesuchFormStep[]> = {
      'sachbearbeitung-app': BaseSteps,
      'gesuch-app': [...BaseSteps, ABSCHLUSS],
    };
    return steps[this.compiletimeConfig.appType].map((step) => ({
      ...step,
      disabled: isStepDisabled(step, gesuchFormular),
    }));
  }
  getTotalSteps(gesuchFormular: GesuchFormularUpdate | null): number {
    return this.getAllSteps(gesuchFormular).length;
  }
  getNext(origin?: SharedModelGesuchFormStep): SharedModelGesuchFormStep {
    const steps = [...StepFlow[this.compiletimeConfig.appType]].sort(
      (s1, s2) => s1.currentStepNumber - s2.currentStepNumber
    );
    const currentIndex = steps.findIndex(
      (step) => step.currentStepNumber === origin?.currentStepNumber
    );
    if (
      currentIndex === -1 ||
      !sharedUtilFnTypeGuardsIsDefined(steps[currentIndex + 1])
    ) {
      throw new Error('Step not defined');
    }
    return steps[currentIndex + 1];
  }
}
