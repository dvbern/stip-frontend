import { SharedModelGesuchFormular, Zivilstand } from '@dv/shared/model/gesuch';
import { SharedModelGesuchFormStep } from './shared-model-gesuch-form';

export const PERSON: SharedModelGesuchFormStep = {
  route: 'person',
  translationKey: 'shared.person.title',
  currentStepNumber: 1,
  iconSymbolName: 'person',
};

export const AUSBILDUNG = {
  route: 'education',
  translationKey: 'shared.education.title',
  currentStepNumber: 2,
  iconSymbolName: 'school',
};

export const LEBENSLAUF = {
  route: 'lebenslauf',
  translationKey: 'shared.lebenslauf.title',
  currentStepNumber: 3,
  iconSymbolName: 'news',
};

export const FAMILIENSITUATION = {
  route: 'familiensituation',
  translationKey: 'shared.familiensituation.title',
  currentStepNumber: 4,
  iconSymbolName: 'family_restroom',
};

export const ELTERN = {
  route: 'eltern',
  translationKey: 'shared.eltern.title',
  currentStepNumber: 5,
  iconSymbolName: 'escalator_warning',
};

export const GESCHWISTER = {
  route: 'geschwister',
  translationKey: 'shared.geschwister.title',
  currentStepNumber: 6,
  iconSymbolName: 'group',
};

export const PARTNER = {
  route: 'partner',
  translationKey: 'shared.partner.title',
  currentStepNumber: 7,
  iconSymbolName: 'favorite',
};

export const KINDER = {
  route: 'kinder',
  translationKey: 'shared.kinder.title',
  currentStepNumber: 8,
  iconSymbolName: 'emoji_people',
};

export const AUSZAHLUNGEN = {
  route: 'auszahlungen',
  translationKey: 'shared.auszahlung.title',
  currentStepNumber: 9,
  iconSymbolName: 'payments',
};

export const EINNAHMEN_KOSTEN = {
  route: 'einnahmenkosten',
  translationKey: 'shared.einnahmenkosten.title',
  currentStepNumber: 10,
  iconSymbolName: 'call_missed_outgoing',
};

export const ABSCHLUSS = {
  route: 'abschluss',
  translationKey: 'shared.abschluss.title',
  currentStepNumber: 11,
  iconSymbolName: 'check_circle',
};

export const isStepDisabled = (
  step: SharedModelGesuchFormStep,
  formular: SharedModelGesuchFormular | null
) => {
  if (step === PARTNER) {
    const zivilstand = formular?.personInAusbildung?.zivilstand;
    return (
      !zivilstand ||
      ![
        Zivilstand.VERHEIRATET,
        Zivilstand.KONKUBINAT,
        Zivilstand.EINGETRAGENE_PARTNERSCHAFT,
      ].includes(zivilstand)
    );
  }
  if (step === ELTERN) {
    const werZahltAlimente = formular?.familiensituation?.werZahltAlimente;
    const mutterUnbekanntVerstorben =
      formular?.familiensituation?.mutterUnbekanntVerstorben;
    const vaterUnbekanntVerstorben =
      formular?.familiensituation?.vaterUnbekanntVerstorben;
    return (
      werZahltAlimente === 'GEMEINSAM' ||
      ((mutterUnbekanntVerstorben === 'VERSTORBEN' ||
        mutterUnbekanntVerstorben === 'UNBEKANNT') &&
        (vaterUnbekanntVerstorben === 'VERSTORBEN' ||
          vaterUnbekanntVerstorben === 'UNBEKANNT'))
    );
  }
  return false;
};
