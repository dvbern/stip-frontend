import {
  Anrede,
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
  let expectMutter = false;

  if (familienSituation) {
    if (familienSituation.elternteilUnbekanntVerstorben) {
      const elternteilStatus =
        geschlecht === 'HERR'
          ? familienSituation?.vaterUnbekanntVerstorben
          : familienSituation?.mutterUnbekanntVerstorben;
      expectMutter = elternteilStatus === 'WEDER_NOCH';
    } else {
      expectMutter = true;
    }
  }
  return expectMutter;
}

export function findElternteil(
  elternTyp: ElternTyp,
  elterns: ElternUpdate[] | undefined
): ElternUpdate | undefined {
  return elterns?.find((eltern) => eltern.elternTyp === elternTyp) || undefined;
}
