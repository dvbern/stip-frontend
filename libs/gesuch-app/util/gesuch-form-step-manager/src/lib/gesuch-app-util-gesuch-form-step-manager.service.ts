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
        return GesuchFormSteps.EDUCATION;
      case GesuchFormSteps.EDUCATION:
        return GesuchFormSteps.EDUCATION;
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
      case GesuchFormSteps.EDUCATION:
        return GesuchFormSteps.PERSON;
      default:
        throw new Error('Step not defined');
    }
  }
}
