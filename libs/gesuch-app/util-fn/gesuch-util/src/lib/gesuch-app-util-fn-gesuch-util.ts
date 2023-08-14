import {
  Anrede,
  ElternAbwesenheitsGrund,
  ElternTyp,
  ElternUpdate,
  FamiliensituationUpdate,
  SharedModelGesuchFormular,
} from '@dv/shared/model/gesuch';

export interface ElternSituation {
  expectVater: boolean;
  expectMutter: boolean;
  vater?: ElternUpdate;
  mutter?: ElternUpdate;
}

export function calculateElternSituationGesuch(
  gesuch: SharedModelGesuchFormular | undefined
): ElternSituation {
  return calculateElternSituation(gesuch?.familiensituation, gesuch?.elterns);
}

function calculateElternSituation(
  familienSituation: FamiliensituationUpdate | undefined,
  elterns: ElternUpdate[] | undefined
): ElternSituation {
  return {
    expectVater: calculateExpectElternteil(Anrede.HERR, familienSituation),
    expectMutter: calculateExpectElternteil(Anrede.FRAU, familienSituation),
    vater: findElternteil(ElternTyp.VATER, elterns),
    mutter: findElternteil(ElternTyp.MUTTER, elterns),
  };
}

export function calculateExpectElternteil(
  geschlecht: Anrede,
  familienSituation: FamiliensituationUpdate | undefined
): boolean {
  if (familienSituation) {
    if (familienSituation.elternteilUnbekanntVerstorben) {
      const elternteilStatus =
        geschlecht === 'HERR'
          ? familienSituation?.vaterUnbekanntVerstorben
          : familienSituation?.mutterUnbekanntVerstorben;
      return elternteilStatus === ElternAbwesenheitsGrund.WEDER_NOCH;
    }
    return true;
  }
  return false;
}

export function findElternteil(
  elternTyp: ElternTyp,
  elterns: ElternUpdate[] | undefined
): ElternUpdate | undefined {
  return elterns?.find((eltern) => eltern.elternTyp === elternTyp) || undefined;
}
