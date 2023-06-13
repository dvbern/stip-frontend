import { GesuchAppModelGesuchFormStep } from './gesuch-app-model-gesuch-form';

export abstract class GesuchFormSteps {
  static readonly PERSON: GesuchAppModelGesuchFormStep = {
    route: 'gesuch-app-feature-gesuch-form-person',
    translationKey: 'gesuch-app.form.person.title',
  };

  static readonly AUSBILDUNG: GesuchAppModelGesuchFormStep = {
    route: 'gesuch-app-feature-gesuch-form-education',
    translationKey: 'gesuch-app.form.education.title',
  };

  static readonly LEBENSLAUF: GesuchAppModelGesuchFormStep = {
    route: 'gesuch-app-feature-gesuch-form-lebenslauf',
    translationKey: 'gesuch-app.form.lebenslauf.title',
  };

  static readonly FAMILIENSITUATION: GesuchAppModelGesuchFormStep = {
    route: 'gesuch-app-feature-gesuch-form-familiensituation',
    translationKey: 'gesuch-app.form.familiensituation.title',
  };

  static readonly ELTERN: GesuchAppModelGesuchFormStep = {
    route: 'gesuch-app-feature-gesuch-form-eltern',
    translationKey: 'gesuch-app.form.eltern.title',
  };

  public static readonly PARTNER: GesuchAppModelGesuchFormStep = {
    route: 'gesuch-app-feature-gesuch-form-partner',
    translationKey: '',
  };
}
