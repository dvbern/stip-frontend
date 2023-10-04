import { Injectable } from '@angular/core';
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
} from '@dv/shared/model/gesuch-form';

@Injectable({
  providedIn: 'root',
})
export class SharedUtilGesuchFormStepManagerService {
  getAllSteps(gesuchFormular: GesuchFormularUpdate | null) {
    return [
      PERSON,
      AUSBILDUNG,
      LEBENSLAUF,
      FAMILIENSITUATION,
      FAMILIENSITUATION,
      ELTERN,
      GESCHWISTER,
      PARTNER,
      KINDER,
      AUSZAHLUNGEN,
      EINNAHMEN_KOSTEN,
    ].map((step) => ({
      ...step,
      disabled: isStepDisabled(step, gesuchFormular),
    }));
  }
  getTotalSteps(gesuchFormular: GesuchFormularUpdate | null): number {
    return this.getAllSteps(gesuchFormular).length;
  }
  getNext(origin?: SharedModelGesuchFormStep): SharedModelGesuchFormStep {
    switch (origin) {
      case PERSON:
        return AUSBILDUNG;
      case AUSBILDUNG:
        return LEBENSLAUF;
      case LEBENSLAUF:
        return FAMILIENSITUATION;
      case FAMILIENSITUATION:
        return ELTERN;
      case ELTERN:
        return GESCHWISTER;
      case GESCHWISTER:
        return PARTNER;
      case PARTNER:
        return KINDER;
      case KINDER:
        return AUSZAHLUNGEN;
      case AUSZAHLUNGEN:
        return EINNAHMEN_KOSTEN;
      case EINNAHMEN_KOSTEN:
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
