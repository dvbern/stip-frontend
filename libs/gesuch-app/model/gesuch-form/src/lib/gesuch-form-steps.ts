import { GesuchAppModelGesuchFormStep } from './gesuch-app-model-gesuch-form';

export abstract class GesuchFormSteps {
  public static readonly COCKPIT: GesuchAppModelGesuchFormStep = {
    enabled: true,
    name: 'gesuch-app-feature-cockpit',
    translationKey: 'COCKPIT_STEP',
  };

  public static readonly PERSON: GesuchAppModelGesuchFormStep = {
    enabled: true,
    name: 'gesuch-app-feature-gesuch-form-person',
    translationKey: '',
  };

  public static readonly AUSBILDUNG: GesuchAppModelGesuchFormStep = {
    enabled: true,
    name: 'gesuch-app-feature-gesuch-form-education',
    translationKey: 'AUSBILDUNG_STEP',
  };

  public static readonly LEBENSLAUF: GesuchAppModelGesuchFormStep = {
    enabled: true,
    name: 'gesuch-app-feature-gesuch-form-lebenslauf',
    translationKey: 'LEBENSLAUF_STEP',
  };

  public static readonly FAMILIENSITUATION: GesuchAppModelGesuchFormStep = {
    enabled: true,
    name: 'gesuch-app-feature-gesuch-form-familiensituation',
    translationKey: 'FAMILIENSITUATION_STEP',
  };

  public static readonly ELTERN_MUTTER: GesuchAppModelGesuchFormStep = {
    enabled: true, // if famSit Mutter lebt noch, abhaengig von FamSit Daten
    name: 'gesuch-app-feature-gesuch-eltern',
    translationKey: '',
  };

  public static readonly ELTERN_VATER: GesuchAppModelGesuchFormStep = {
    enabled: true, // if famSit Vater lebt noch, abhaengig von FamSit Daten
    name: 'gesuch-app-feature-gesuch-eltern',
    translationKey: '',
  };

  public static readonly AUSZAHLUNGEN: GesuchAppModelGesuchFormStep = {
    enabled: true,
    name: 'gesuch-app-feature-gesuch-form-auszahlungen',
    translationKey: 'AUSZAHLUNGEN_STEP',
  };
}
