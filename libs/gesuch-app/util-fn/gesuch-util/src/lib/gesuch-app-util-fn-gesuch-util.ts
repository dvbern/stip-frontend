import {
  Anrede,
  ElternContainerDTO,
  ElternDTO,
  FamiliensituationDTO,
} from '@dv/shared/model/gesuch';

export function calculateElternSituation(
  familienSituation: FamiliensituationDTO | undefined,
  elternContainers: ElternContainerDTO[] | undefined
): {
  expectVater: boolean;
  expectMutter: boolean;
  vater?: ElternDTO;
  mutter?: ElternDTO;
} {
  const vater = elternContainers?.find(
    (elternContainer) => elternContainer.elternSB?.geschlecht === Anrede.HERR
  )?.elternSB;
  const mutter = elternContainers?.find(
    (elternContainer) => elternContainer.elternSB?.geschlecht === Anrede.FRAU
  )?.elternSB;

  return {
    expectVater: calculateExpectElternteil(Anrede.HERR, familienSituation),
    expectMutter: calculateExpectElternteil(Anrede.FRAU, familienSituation),
    vater: findElternteil(Anrede.HERR, elternContainers),
    mutter: findElternteil(Anrede.FRAU, elternContainers),
  };
}

export function calculateExpectElternteil(
  geschlecht: Anrede,
  familienSituation: FamiliensituationDTO | undefined
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
  geschlecht: Anrede,
  elternContainers: ElternContainerDTO[] | undefined
): ElternDTO | undefined {
  return (
    elternContainers?.find(
      (elternContainer) => elternContainer.elternSB?.geschlecht === geschlecht
    )?.elternSB || undefined
  );
}
