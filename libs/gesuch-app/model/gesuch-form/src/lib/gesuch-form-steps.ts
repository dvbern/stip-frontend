import { GesuchAppModelGesuchFormStep } from './gesuch-app-model-gesuch-form';

export abstract class GesuchFormSteps {
  public static readonly COCKPIT: GesuchAppModelGesuchFormStep = {
    enabled: true,
    name: 'gesuch-app-feature-cockpit',
    translationKey: 'COCKPIT_STEP',
  };

  public static readonly PERSON: GesuchAppModelGesuchFormStep = {
    enabled: true,
    name: '',
    translationKey: '',
  };

  public static readonly EDUCATION: GesuchAppModelGesuchFormStep = {
    enabled: true,
    name: 'gesuch-app-feature-gesuch-form-education',
    translationKey: 'EDUCATION_STEP',
  };
}
