import { Kontoinhaber } from '@dv/shared/model/gesuch';
import {
  calculateHasNecessaryPreSteps,
  calculateKontoinhaberValues,
} from './shared-feature-gesuch-form-auszahlungen.selector';

describe('gesuch util', () => {
  it.each([
    // expectVater, expectMutter | expected Kontoinhaberliste

    [
      'keine Eltern',
      false,
      false,
      [
        Kontoinhaber.GESUCHSTELLER,
        Kontoinhaber.SOZIALDIENST_INSTITUTION,
        Kontoinhaber.ANDERE,
      ],
    ],
    [
      'Vater expected ',
      true,
      false,
      [
        Kontoinhaber.GESUCHSTELLER,
        Kontoinhaber.VATER,
        Kontoinhaber.SOZIALDIENST_INSTITUTION,
        Kontoinhaber.ANDERE,
      ],
    ],
    [
      'Mutter expected',
      false,
      true,
      [
        Kontoinhaber.GESUCHSTELLER,
        Kontoinhaber.MUTTER,
        Kontoinhaber.SOZIALDIENST_INSTITUTION,
        Kontoinhaber.ANDERE,
      ],
    ],
    [
      'beide expected',
      true,
      true,
      [
        Kontoinhaber.GESUCHSTELLER,
        Kontoinhaber.VATER,
        Kontoinhaber.MUTTER,
        Kontoinhaber.SOZIALDIENST_INSTITUTION,
        Kontoinhaber.ANDERE,
      ],
    ],
  ])(
    'Kontoinhaber values: %s',
    (
      label: string,
      expectVater: boolean,
      expectMutter: boolean,
      expectedList: Kontoinhaber[]
    ) => {
      const list = calculateKontoinhaberValues({
        expectVater,
        expectMutter,
        vater: undefined,
        mutter: undefined,
      });

      expect(list).toEqual(expectedList);
    }
  );

  it.each([
    // expectVater, expectMutter, vater, mutter | expected ok

    ['niemand expected', false, false, null, null, true],
    ['expected Vater but missing', true, false, null, null, false],
    ['expected and valid Vater', true, false, {}, null, true],
    ['expected both but missing Mutter', true, true, {}, null, false],
    ['expected and valid both', true, true, {}, {}, true],
  ])(
    'Pre steps ok: %s',
    (
      label: string,
      expectVater: boolean,
      expectMutter: boolean,
      vater: any,
      mutter: any,
      expectedOk: boolean
    ) => {
      const ok = calculateHasNecessaryPreSteps({
        expectVater,
        expectMutter,
        vater: vater,
        mutter: mutter,
      });

      expect(ok).toEqual(expectedOk);
    }
  );
});
