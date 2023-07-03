import {
  Anrede,
  ElternAbwesenheitsGrund,
  FamiliensituationDTO,
} from '@dv/shared/model/gesuch';
import { calculateExpectElternteil } from './gesuch-app-util-fn-gesuch-util';

describe('gesuch util', () => {
  it.each([
    // verstorben geschlecht  elternstatus     expectParent

    // niemand verstorben -> beide Eltern expected
    [false, Anrede.HERR, undefined, true],
    [false, Anrede.FRAU, undefined, true],

    // jemand verstorben -> expected, wenn Grund "WEDER_NOCH"
    [true, Anrede.HERR, ElternAbwesenheitsGrund.VERSTORBEN, false],
    [true, Anrede.HERR, ElternAbwesenheitsGrund.UNBEKANNT, false],
    [true, Anrede.HERR, ElternAbwesenheitsGrund.WEDER_NOCH, true],
    [true, Anrede.FRAU, ElternAbwesenheitsGrund.VERSTORBEN, false],
    [true, Anrede.FRAU, ElternAbwesenheitsGrund.UNBEKANNT, false],
    [true, Anrede.FRAU, ElternAbwesenheitsGrund.WEDER_NOCH, true],

    // elternteilUnbekanntVerstorben undefined -> beide expected
    [undefined, Anrede.HERR, ElternAbwesenheitsGrund.UNBEKANNT, true],
    [undefined, Anrede.FRAU, ElternAbwesenheitsGrund.UNBEKANNT, true],
  ])(
    'jemand verstorben/unbekannt: %s, geschlecht %s mit status %s => expected Elternteil %s',
    (
      elternteilUnbekanntVerstorben: boolean | undefined,
      geschlecht: Anrede,
      grund: ElternAbwesenheitsGrund | undefined,
      expectElternteil: boolean
    ) => {
      const familienSituation: FamiliensituationDTO = {
        elternteilUnbekanntVerstorben,
      } as FamiliensituationDTO;
      if (geschlecht === 'HERR') {
        familienSituation.vaterUnbekanntVerstorben = grund;
      }
      if (geschlecht === 'FRAU') {
        familienSituation.mutterUnbekanntVerstorben = grund;
      }

      expect(calculateExpectElternteil(geschlecht, familienSituation)).toEqual(
        expectElternteil
      );
    }
  );
});
