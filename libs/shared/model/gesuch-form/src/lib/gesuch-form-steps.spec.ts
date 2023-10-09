import {
  Elternschaftsteilung,
  SharedModelGesuchFormular,
  Zivilstand,
} from '@dv/shared/model/gesuch';
import { ELTERN, isStepDisabled, PARTNER } from './gesuch-form-steps';

type GesuchFormStepState = 'enable' | 'disable';
const partnerCases = (): [GesuchFormStepState, Zivilstand, boolean][] => {
  return [
    ['disable', 'LEDIG', true],
    ['disable', 'VERWITWET', true],
    ['disable', 'AUFGELOESTE_PARTNERSCHAFT', true],
    ['disable', 'GESCHIEDEN_GERICHTLICH', true],
    ['enable', 'KONKUBINAT', false],
    ['enable', 'VERHEIRATET', false],
    ['enable', 'EINGETRAGENE_PARTNERSCHAFT', false],
  ];
};

const alimentAufteilungCases = (): [
  GesuchFormStepState,
  Elternschaftsteilung,
  boolean
][] => [
  ['enable', Elternschaftsteilung.MUTTER, false],
  ['enable', Elternschaftsteilung.VATER, false],
  ['disable', Elternschaftsteilung.GEMEINSAM, true],
];

describe('GesuchFormSteps', () => {
  it.each(partnerCases())(
    'should %s Partner Step if GS is %s',
    (_, zivilstand, state) => {
      expect(
        isStepDisabled(PARTNER, {
          personInAusbildung: {
            zivilstand,
          },
        } as Partial<SharedModelGesuchFormular>)
      ).toBe(state);
    }
  );

  it.each(alimentAufteilungCases())(
    'should %s Eltern Step if GS is %s',
    (_, werZahltAlimente, state) => {
      expect(
        isStepDisabled(ELTERN, {
          familiensituation: {
            werZahltAlimente,
          },
        } as Partial<SharedModelGesuchFormular>)
      ).toBe(state);
    }
  );
});
