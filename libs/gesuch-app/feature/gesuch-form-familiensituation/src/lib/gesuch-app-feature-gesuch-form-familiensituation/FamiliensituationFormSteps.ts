import { FamiliensituationUpdate } from '@dv/shared/model/gesuch';

export interface FamiliensituationFormStep {
  getNext(
    familiensituation: FamiliensituationUpdate
  ): FamiliensituationFormStep;

  getPrevious(
    familienstituation: FamiliensituationUpdate
  ): FamiliensituationFormStep;
}

// Helper function to ensure type safety in our map
function createFamSitStep(famStiS: FamiliensituationFormStep) {
  return famStiS;
}

export const FamiliensituationFormSteps = {
  ELTERN_VERHEIRATET_ZUSAMMEN: createFamSitStep({
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
    getNext(
      familiensituation: FamiliensituationUpdate
    ): FamiliensituationFormStep {
      if (familiensituation.gerichtlicheAlimentenregelung === null) {
        return this;
      }
      return familiensituation.gerichtlicheAlimentenregelung
        ? FamiliensituationFormSteps.WER_ZAHLT_ALIMENTE
        : FamiliensituationFormSteps.ELTERN_UNBEKANNT_VERSTORBEN;
    },
    getPrevious(): FamiliensituationFormStep {
      return FamiliensituationFormSteps.ELTERN_VERHEIRATET_ZUSAMMEN;
    },
  }),

  WER_ZAHLT_ALIMENTE: createFamSitStep({
    getNext(
      familiensituation: FamiliensituationUpdate
    ): FamiliensituationFormStep {
      if (
        familiensituation.werZahltAlimente === null ||
        familiensituation.werZahltAlimente === 'GEMEINSAM'
      ) {
        return this;
      }
      return familiensituation.werZahltAlimente === 'VATER'
        ? FamiliensituationFormSteps.MUTTER_WIEDERVERHEIRATET
        : FamiliensituationFormSteps.VATER_WIEDERVERHEIRATET;
    },
    getPrevious(): FamiliensituationFormStep {
      return FamiliensituationFormSteps.ALIMENTENREGELUNG;
    },
  }),

  VATER_WIEDERVERHEIRATET: createFamSitStep({
    getNext(): FamiliensituationFormStep {
      return this;
    },
    getPrevious(
      familiensituation: FamiliensituationUpdate
    ): FamiliensituationFormStep {
      if (familiensituation.werZahltAlimente === 'MUTTER') {
        return FamiliensituationFormSteps.WER_ZAHLT_ALIMENTE;
      }
      if (familiensituation.mutterUnbekanntGrund !== null) {
        return FamiliensituationFormSteps.WIESO_MUTTER_UNBEKANNT;
      }
      return FamiliensituationFormSteps.WELCHER_ELTERNTEIL_UNBEKANNT_VERSTORBEN;
    },
  }),

  MUTTER_WIEDERVERHEIRATET: createFamSitStep({
    getNext(): FamiliensituationFormStep {
      return this;
    },
    getPrevious(
      familiensituation: FamiliensituationUpdate
    ): FamiliensituationFormStep {
      if (familiensituation.werZahltAlimente === 'VATER') {
        return FamiliensituationFormSteps.WER_ZAHLT_ALIMENTE;
      }
      if (familiensituation.vaterUnbekanntGrund !== null) {
        return FamiliensituationFormSteps.WIESO_VATER_UNBEKANNT;
      }
      return FamiliensituationFormSteps.WELCHER_ELTERNTEIL_UNBEKANNT_VERSTORBEN;
    },
  }),

  WIESO_VATER_UNBEKANNT: createFamSitStep({
    getNext(
      familiensituation: FamiliensituationUpdate
    ): FamiliensituationFormStep {
      return familiensituation.vaterUnbekanntGrund === null
        ? this
        : FamiliensituationFormSteps.MUTTER_WIEDERVERHEIRATET;
    },
    getPrevious(): FamiliensituationFormStep {
      return FamiliensituationFormSteps.WELCHER_ELTERNTEIL_UNBEKANNT_VERSTORBEN;
    },
  }),

  WIESO_MUTTER_UNBEKANNT: createFamSitStep({
    getNext(
      familiensituation: FamiliensituationUpdate
    ): FamiliensituationFormStep {
      return familiensituation.mutterUnbekanntGrund === null
        ? this
        : FamiliensituationFormSteps.VATER_WIEDERVERHEIRATET;
    },
    getPrevious(): FamiliensituationFormStep {
      return FamiliensituationFormSteps.WELCHER_ELTERNTEIL_UNBEKANNT_VERSTORBEN;
    },
  }),

  ELTERN_UNBEKANNT_VERSTORBEN: createFamSitStep({
    getNext(
      familiensituation: FamiliensituationUpdate
    ): FamiliensituationFormStep {
      if (familiensituation.elternteilUnbekanntVerstorben === null) {
        return this;
      }
      return familiensituation.elternteilUnbekanntVerstorben
        ? FamiliensituationFormSteps.WELCHER_ELTERNTEIL_UNBEKANNT_VERSTORBEN
        : FamiliensituationFormSteps.ZWEI_FAMILIENBUDGET;
    },
    getPrevious(): FamiliensituationFormStep {
      return FamiliensituationFormSteps.ALIMENTENREGELUNG;
    },
  }),

  WELCHER_ELTERNTEIL_UNBEKANNT_VERSTORBEN: createFamSitStep({
    getNext(
      familiensituation: FamiliensituationUpdate
    ): FamiliensituationFormStep {
      if (
        familiensituation.vaterUnbekanntVerstorben === null ||
        familiensituation.mutterUnbekanntVerstorben === null
      ) {
        return this;
      }
      if (
        familiensituation.vaterUnbekanntVerstorben === 'WEDER_NOCH' &&
        familiensituation.mutterUnbekanntVerstorben !== 'WEDER_NOCH'
      ) {
        return familiensituation.mutterUnbekanntVerstorben === 'UNBEKANNT'
          ? FamiliensituationFormSteps.WIESO_MUTTER_UNBEKANNT
          : FamiliensituationFormSteps.VATER_WIEDERVERHEIRATET;
      }

      if (
        familiensituation.mutterUnbekanntVerstorben === 'WEDER_NOCH' &&
        familiensituation.vaterUnbekanntVerstorben !== 'WEDER_NOCH'
      ) {
        return familiensituation.vaterUnbekanntVerstorben === 'UNBEKANNT'
          ? FamiliensituationFormSteps.WIESO_VATER_UNBEKANNT
          : FamiliensituationFormSteps.MUTTER_WIEDERVERHEIRATET;
      }
      return this;
    },
    getPrevious(): FamiliensituationFormStep {
      return FamiliensituationFormSteps.ELTERN_UNBEKANNT_VERSTORBEN;
    },
  }),

  ZWEI_FAMILIENBUDGET: createFamSitStep({
    getNext(): FamiliensituationFormStep {
      return this;
    },
    getPrevious(): FamiliensituationFormStep {
      return FamiliensituationFormSteps.ELTERN_UNBEKANNT_VERSTORBEN;
    },
  }),
} as const;

export type FamiliensituationFormSteps = typeof FamiliensituationFormSteps;
