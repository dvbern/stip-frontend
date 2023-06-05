import { Injectable } from '@angular/core';
import {
  GesuchAppModelGesuchFormStep,
  GesuchFormSteps,
} from '@dv/gesuch-app/model/gesuch-form';

@Injectable({
  providedIn: 'root',
})
export class GesuchAppUtilGesuchFormStepManagerService {
  public getNext(
    origin: GesuchAppModelGesuchFormStep
  ): GesuchAppModelGesuchFormStep {
    switch (origin) {
      case GesuchFormSteps.COCKPIT:
        return GesuchFormSteps.PERSON;
      case GesuchFormSteps.PERSON:
        return GesuchFormSteps.AUSBILDUNG;
      case GesuchFormSteps.AUSBILDUNG:
        return GesuchFormSteps.LEBENSLAUF;
      case GesuchFormSteps.LEBENSLAUF:
        return GesuchFormSteps.COCKPIT;
      default:
        throw new Error('Step not defined');
    }
  }
  public getPrevious(
    origin: GesuchAppModelGesuchFormStep
  ): GesuchAppModelGesuchFormStep {
    switch (origin) {
      case GesuchFormSteps.COCKPIT:
        return GesuchFormSteps.COCKPIT;
      case GesuchFormSteps.PERSON:
        return GesuchFormSteps.COCKPIT;
      case GesuchFormSteps.AUSBILDUNG:
        return GesuchFormSteps.PERSON;
      case GesuchFormSteps.LEBENSLAUF:
        return GesuchFormSteps.AUSBILDUNG;
      default:
        throw new Error('Step not defined');
    }
  }
}
