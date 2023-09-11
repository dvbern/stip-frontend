import {
  ElternAbwesenheitsGrund,
  ElternTyp,
  Familiensituation,
} from '@dv/shared/model/gesuch';
import { calculateExpectElternteil } from './shared-util-fn-gesuch-util';

describe('gesuch util', () => {
  it.each([
    // verstorben geschlecht  elternstatus     expectParent

    // niemand verstorben -> beide Eltern expected
    [false, ElternTyp.VATER, undefined, true],
    [false, ElternTyp.MUTTER, undefined, true],

    // jemand verstorben -> expected, wenn Grund "WEDER_NOCH"
    [true, ElternTyp.VATER, ElternAbwesenheitsGrund.VERSTORBEN, false],
    [true, ElternTyp.VATER, ElternAbwesenheitsGrund.UNBEKANNT, false],
    [true, ElternTyp.VATER, ElternAbwesenheitsGrund.WEDER_NOCH, true],
    [true, ElternTyp.MUTTER, ElternAbwesenheitsGrund.VERSTORBEN, false],
    [true, ElternTyp.MUTTER, ElternAbwesenheitsGrund.UNBEKANNT, false],
    [true, ElternTyp.MUTTER, ElternAbwesenheitsGrund.WEDER_NOCH, true],

    // elternteilUnbekanntVerstorben undefined -> beide expected
    [undefined, ElternTyp.VATER, ElternAbwesenheitsGrund.UNBEKANNT, true],
    [undefined, ElternTyp.MUTTER, ElternAbwesenheitsGrund.UNBEKANNT, true],
  ])(
    'jemand verstorben/unbekannt: %s, geschlecht %s mit status %s => expected Elternteil %s',
    (
      elternteilUnbekanntVerstorben: boolean | undefined,
      elternTyp: ElternTyp,
      grund: ElternAbwesenheitsGrund | undefined,
      expectElternteil: boolean
    ) => {
      const familienSituation: Familiensituation = {
        elternteilUnbekanntVerstorben,
      } as Familiensituation;
      if (elternTyp === 'VATER') {
        familienSituation.vaterUnbekanntVerstorben = grund;
      }
      if (elternTyp === 'MUTTER') {
        familienSituation.mutterUnbekanntVerstorben = grund;
      }

      expect(calculateExpectElternteil(elternTyp, familienSituation)).toEqual(
        expectElternteil
      );
    }
  );
});
