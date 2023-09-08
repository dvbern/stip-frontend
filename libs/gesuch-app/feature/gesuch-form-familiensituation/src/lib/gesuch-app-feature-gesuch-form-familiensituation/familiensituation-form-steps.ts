import { FamiliensituationUpdate } from '@dv/shared/model/gesuch';

export type FamiliensituationFormStepName =
  | 'ELTERN_VERHEIRATET_ZUSAMMEN'
  | 'ALIMENTENREGELUNG'
  | 'ELTERN_UNBEKANNT_VERSTORBEN'
  | 'ZWEI_FAMILIENBUDGET';

export interface FamiliensituationFormStep {
  getNext(
    familiensituation: FamiliensituationUpdate
  ): FamiliensituationFormStep;

  getPrevious(
    familienstituation: FamiliensituationUpdate
  ): FamiliensituationFormStep;
  name: FamiliensituationFormStepName;
}

// Helper function to ensure type safety in our map
function createFamSitStep(famStiS: FamiliensituationFormStep) {
  return famStiS;
}

export const FamiliensituationFormSteps = {
  ELTERN_VERHEIRATET_ZUSAMMEN: createFamSitStep({
    name: 'ELTERN_VERHEIRATET_ZUSAMMEN',
    getNext(
      familiensituation: FamiliensituationUpdate
    ): FamiliensituationFormStep {
      if (familiensituation.elternVerheiratetZusammen === null) {
        return this;
      }
      return familiensituation.elternVerheiratetZusammen
        ? this
        : FamiliensituationFormSteps.ALIMENTENREGELUNG;
    },
    getPrevious(): FamiliensituationFormStep {
      return this;
    },
  }),

  ALIMENTENREGELUNG: createFamSitStep({
    name: 'ALIMENTENREGELUNG',
    getNext(
      familiensituation: FamiliensituationUpdate
    ): FamiliensituationFormStep {
      return familiensituation.gerichtlicheAlimentenregelung === false
        ? FamiliensituationFormSteps.ELTERN_UNBEKANNT_VERSTORBEN
        : this;
    },
    getPrevious(): FamiliensituationFormStep {
      return FamiliensituationFormSteps.ELTERN_VERHEIRATET_ZUSAMMEN;
    },
  }),

  ELTERN_UNBEKANNT_VERSTORBEN: createFamSitStep({
    name: 'ELTERN_UNBEKANNT_VERSTORBEN',
    getNext(
      familiensituation: FamiliensituationUpdate
    ): FamiliensituationFormStep {
      return familiensituation.elternteilUnbekanntVerstorben === false
        ? FamiliensituationFormSteps.ZWEI_FAMILIENBUDGET
        : this;
    },
    getPrevious(): FamiliensituationFormStep {
      return FamiliensituationFormSteps.ALIMENTENREGELUNG;
    },
  }),

  ZWEI_FAMILIENBUDGET: createFamSitStep({
    name: 'ZWEI_FAMILIENBUDGET',
    getNext(): FamiliensituationFormStep {
      return this;
    },
    getPrevious(): FamiliensituationFormStep {
      return FamiliensituationFormSteps.ELTERN_UNBEKANNT_VERSTORBEN;
    },
  }),
} as const;

export type FamiliensituationFormSteps = typeof FamiliensituationFormSteps;
