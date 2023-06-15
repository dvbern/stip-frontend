import { Injectable } from '@angular/core';

import {
  GesuchAppModelGesuchFormStep,
  GesuchFormSteps,
} from '@dv/gesuch-app/model/gesuch-form';

@Injectable({
  providedIn: 'root',
})
export class GesuchAppUtilGesuchFormStepManagerService {
  getTotalSteps(): number {
    return Object.entries(GesuchFormSteps).length;
  }
  getNext(origin?: GesuchAppModelGesuchFormStep): GesuchAppModelGesuchFormStep {
    switch (origin) {
      case GesuchFormSteps.PERSON:
        return GesuchFormSteps.AUSBILDUNG;
      case GesuchFormSteps.AUSBILDUNG:
        return GesuchFormSteps.FAMILIENSITUATION;
      case GesuchFormSteps.LEBENSLAUF:
        return GesuchFormSteps.FAMILIENSITUATION;
      case GesuchFormSteps.FAMILIENSITUATION:
        return GesuchFormSteps.ELTERN;
      case GesuchFormSteps.ELTERN:
        return GesuchFormSteps.GESCHWISTER;
      case GesuchFormSteps.GESCHWISTER:
        return GesuchFormSteps.PARTNER;
      case GesuchFormSteps.PARTNER:
        return GesuchFormSteps.AUSZAHLUNGEN;
      case GesuchFormSteps.AUSZAHLUNGEN:
        return GesuchFormSteps.AUSZAHLUNGEN;
      default:
        throw new Error('Step not defined');
    }
  }
}
