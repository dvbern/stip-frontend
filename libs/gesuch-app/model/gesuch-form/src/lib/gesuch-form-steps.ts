import { GesuchAppModelGesuchFormStep } from './gesuch-app-model-gesuch-form';

export abstract class GesuchFormSteps {
  static readonly PERSON: GesuchAppModelGesuchFormStep = {
    route: 'gesuch-app-feature-gesuch-form-person',
    translationKey: 'gesuch-app.form.person.title',
    currentStepNumber: 1,
    iconSymbolName: 'person',
  };

  static readonly AUSBILDUNG: GesuchAppModelGesuchFormStep = {
    route: 'gesuch-app-feature-gesuch-form-education',
    translationKey: 'gesuch-app.form.education.title',
    currentStepNumber: 2,
    iconSymbolName: 'school',
  };

  static readonly LEBENSLAUF: GesuchAppModelGesuchFormStep = {
    route: 'gesuch-app-feature-gesuch-form-lebenslauf',
    translationKey: 'gesuch-app.form.lebenslauf.title',
    currentStepNumber: 3,
    iconSymbolName: 'news',
  };

  static readonly FAMILIENSITUATION: GesuchAppModelGesuchFormStep = {
    route: 'gesuch-app-feature-gesuch-form-familiensituation',
    translationKey: 'gesuch-app.familiensituation.title',
    currentStepNumber: 4,
    iconSymbolName: 'family_restroom',
  };

  static readonly ELTERN: GesuchAppModelGesuchFormStep = {
    route: 'gesuch-app-feature-gesuch-form-eltern',
    translationKey: 'gesuch-app.form.eltern.title',
    currentStepNumber: 5,
    iconSymbolName: 'escalator_warning',
  };

  public static readonly GESCHWISTER: GesuchAppModelGesuchFormStep = {
    route: 'gesuch-app-feature-gesuch-form-geschwister',
    translationKey: 'gesuch-app.form.geschwister.title',
    currentStepNumber: 6,
    iconSymbolName: 'group',
  };

  public static readonly PARTNER: GesuchAppModelGesuchFormStep = {
    route: 'gesuch-app-feature-gesuch-form-partner',
    translationKey: 'gesuch-app.form.partner.title',
    currentStepNumber: 7,
    iconSymbolName: 'favorite',
  };

  public static readonly KINDER: GesuchAppModelGesuchFormStep = {
    route: 'gesuch-app-feature-gesuch-form-kinder',
    translationKey: 'gesuch-app.form.kinder.title',
    currentStepNumber: 8,
    iconSymbolName: 'emoji_people',
  };

  public static readonly AUSZAHLUNGEN: GesuchAppModelGesuchFormStep = {
    route: 'gesuch-app-feature-gesuch-form-auszahlungen',
    translationKey: 'gesuch-app.auszahlung.title',
    currentStepNumber: 9,
    iconSymbolName: 'payments',
  };

  public static readonly EINNAHMEN_KOSTEN: GesuchAppModelGesuchFormStep = {
    route: 'gesuch-app-feature-gesuch-form-einnahmenkosten',
    translationKey: 'gesuch-app.einnahmenkosten.title',
    currentStepNumber: 10,
    iconSymbolName: 'call_missed_outgoing',
  };
}
