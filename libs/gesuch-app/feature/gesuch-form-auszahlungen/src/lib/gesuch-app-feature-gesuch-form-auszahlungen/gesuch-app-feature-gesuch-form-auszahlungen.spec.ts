import { KontoinhaberinType } from '@dv/shared/model/gesuch';
import {
  calculateHasNecessaryPreSteps,
  calculateKontoinhaberValues,
} from './gesuch-app-feature-gesuch-form-auszahlungen.selector';

describe('gesuch util', () => {
  it.each([
    // expectVater, expectMutter | expected Kontoinhaberliste

    [
      'keine Eltern',
      false,
      false,
      [
        KontoinhaberinType.GESUCHSTELLERIN,
        KontoinhaberinType.SOZIALDIENST_INSTITUTION,
        KontoinhaberinType.ANDERE,
      ],
    ],
    [
      'Vater expected ',
      true,
      false,
      [
        KontoinhaberinType.GESUCHSTELLERIN,
        KontoinhaberinType.VATER,
        KontoinhaberinType.SOZIALDIENST_INSTITUTION,
        KontoinhaberinType.ANDERE,
      ],
    ],
    [
      'Mutter expected',
      false,
      true,
      [
        KontoinhaberinType.GESUCHSTELLERIN,
        KontoinhaberinType.MUTTER,
        KontoinhaberinType.SOZIALDIENST_INSTITUTION,
        KontoinhaberinType.ANDERE,
      ],
    ],
    [
      'beide expected',
      true,
      true,
      [
        KontoinhaberinType.GESUCHSTELLERIN,
        KontoinhaberinType.VATER,
        KontoinhaberinType.MUTTER,
        KontoinhaberinType.SOZIALDIENST_INSTITUTION,
        KontoinhaberinType.ANDERE,
      ],
    ],
  ])(
    'Kontoinhaber values: %s',
    (
      label: string,
      expectVater: boolean,
      expectMutter: boolean,
      expectedList: KontoinhaberinType[]
    ) => {
      const list = calculateKontoinhaberValues({
        expectVater,
        expectMutter,
        vater: null,
        mutter: null,
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
