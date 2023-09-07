import { SharedModelGesuchFormular, Zivilstand } from '@dv/shared/model/gesuch';
import { isStepDisabled } from './gesuch-form-steps';

const partnerCases = (): ['enable' | 'disable', Zivilstand, boolean][] => {
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

describe('GesuchFormSteps', () => {
  it.each(partnerCases())(
    'should %s Partner Step if GS is %s',
    (_, zivilstand, state) => {
      expect(
        isStepDisabled('PARTNER', {
          personInAusbildung: {
            zivilstand,
          },
        } as Partial<SharedModelGesuchFormular>)
      ).toBe(state);
    }
  );
});
