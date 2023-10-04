import { Injectable } from '@angular/core';
import { GesuchFormularUpdate } from '@dv/shared/model/gesuch';

import {
  SharedModelGesuchFormStep,
  GesuchFormSteps,
  isStepDisabled,
} from '@dv/shared/model/gesuch-form';

@Injectable({
  providedIn: 'root',
})
export class SharedUtilGesuchFormStepManagerService {
  getAllSteps(gesuchFormular: GesuchFormularUpdate | null) {
    return (
      Object.entries(GesuchFormSteps) as [
        keyof GesuchFormSteps,
        GesuchFormSteps[keyof GesuchFormSteps]
      ][]
    ).map(([name, step]) => ({
      name,
      ...step,
      disabled: isStepDisabled(name, gesuchFormular),
    }));
  }
  getTotalSteps(gesuchFormular: GesuchFormularUpdate | null): number {
    return this.getAllSteps(gesuchFormular).length;
  }
  getNext(origin?: SharedModelGesuchFormStep): SharedModelGesuchFormStep {
    switch (origin) {
      case GesuchFormSteps.PERSON:
        return GesuchFormSteps.AUSBILDUNG;
      case GesuchFormSteps.AUSBILDUNG:
        return GesuchFormSteps.LEBENSLAUF;
      case GesuchFormSteps.LEBENSLAUF:
        return GesuchFormSteps.FAMILIENSITUATION;
      case GesuchFormSteps.FAMILIENSITUATION:
        return GesuchFormSteps.ELTERN;
      case GesuchFormSteps.ELTERN:
        return GesuchFormSteps.GESCHWISTER;
      case GesuchFormSteps.GESCHWISTER:
        return GesuchFormSteps.PARTNER;
      case GesuchFormSteps.PARTNER:
        return GesuchFormSteps.KINDER;
      case GesuchFormSteps.KINDER:
        return GesuchFormSteps.AUSZAHLUNGEN;
      case GesuchFormSteps.AUSZAHLUNGEN:
        return GesuchFormSteps.EINNAHMEN_KOSTEN;
      case GesuchFormSteps.EINNAHMEN_KOSTEN:
        return {
          route: '/',
          translationKey: '',
          currentStepNumber: -1,
          iconSymbolName: '',
        };
      default:
        throw new Error('Step not defined');
    }
  }
}
