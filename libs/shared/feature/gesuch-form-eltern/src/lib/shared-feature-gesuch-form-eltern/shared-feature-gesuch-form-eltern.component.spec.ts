import { ElternTyp, PersonInAusbildungUpdate } from '@dv/shared/model/gesuch';

import { setupElternTeil } from './shared-feature-gesuch-form-eltern.component';

describe('SharedFeatureGesuchFormElternComponent', () => {
  const adresse = {
    land: 'CH',
    ort: 'Bern',
    plz: '3011',
    strasse: 'Postgasse',
    hausnummer: '1',
  } as const;

  it.each`
    wohnsitz              | expected     | shouldContain
    ${'FAMILIE'}          | ${'Bern'}    | ${'should'}
    ${'MUTTER_VATER'}     | ${undefined} | ${'should not'}
    ${'EIGENER_HAUSHALT'} | ${undefined} | ${'should not'}
  `(
    '$shouldContain prefill the address with personInAusbildung if $wohnsitz',
    ({ wohnsitz, expected }) => {
      const editedElternteil = setupElternTeil(ElternTyp.VATER, {
        personInAusbildung: {
          ...({} as PersonInAusbildungUpdate),
          wohnsitz,
          adresse,
        },
      });
      expect(editedElternteil?.adresse?.ort).toBe(expected);
    }
  );
});
