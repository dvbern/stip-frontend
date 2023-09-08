import { FamiliensituationUpdate } from '@dv/shared/model/gesuch';
import { FamiliensituationFormSteps } from './familiensituation-form-steps';

describe('familiensituation-form-steps', () => {
  describe('Step "Sind die leiblichen Eltern verheiratet oder wohnen zusammen"', () => {
    const step = FamiliensituationFormSteps.ELTERN_VERHEIRATET_ZUSAMMEN;

    it('has question answered true', () => {
      const famSit: FamiliensituationUpdate = {
        elternVerheiratetZusammen: true,
      };
      expect(step.getPrevious(famSit)).toEqual(
        FamiliensituationFormSteps.ELTERN_VERHEIRATET_ZUSAMMEN
      );
      expect(step.getNext(famSit)).toEqual(
        FamiliensituationFormSteps.ELTERN_VERHEIRATET_ZUSAMMEN
      );
    });
    it('has question answered false', () => {
      const famSit: FamiliensituationUpdate = {
        elternVerheiratetZusammen: false,
      };
      expect(step.getPrevious(famSit)).toEqual(
        FamiliensituationFormSteps.ELTERN_VERHEIRATET_ZUSAMMEN
      );
      expect(step.getNext(famSit)).toEqual(
        FamiliensituationFormSteps.ALIMENTENREGELUNG
      );
    });
  });

  describe('Step "Existiert eine gerichtliche Alimentenregelung"', () => {
    const step = FamiliensituationFormSteps.ALIMENTENREGELUNG;
    let famSit: FamiliensituationUpdate;

    beforeEach(() => {
      famSit = { elternVerheiratetZusammen: true };
    });

    it('has question not answered', () => {
      famSit.gerichtlicheAlimentenregelung = undefined;
      expect(step.getPrevious(famSit)).toEqual(
        FamiliensituationFormSteps.ELTERN_VERHEIRATET_ZUSAMMEN
      );
      expect(step.getNext(famSit)).toEqual(
        FamiliensituationFormSteps.ALIMENTENREGELUNG
      );
    });
    it('has question answered true', () => {
      famSit.gerichtlicheAlimentenregelung = true;
      expect(step.getPrevious(famSit)).toEqual(
        FamiliensituationFormSteps.ELTERN_VERHEIRATET_ZUSAMMEN
      );
      expect(step.getNext(famSit)).toEqual(
        FamiliensituationFormSteps.ALIMENTENREGELUNG
      );
    });
    it('has question answered false', () => {
      famSit.gerichtlicheAlimentenregelung = false;
      expect(step.getPrevious(famSit)).toEqual(
        FamiliensituationFormSteps.ELTERN_VERHEIRATET_ZUSAMMEN
      );
      expect(step.getNext(famSit)).toEqual(
        FamiliensituationFormSteps.ELTERN_UNBEKANNT_VERSTORBEN
      );
    });
  });

  describe('Step "Ist ein ELternteil unbekannt oder verstorben"', () => {
    const step = FamiliensituationFormSteps.ELTERN_UNBEKANNT_VERSTORBEN;
    let famSit: FamiliensituationUpdate;

    beforeEach(() => {
      famSit = {
        elternVerheiratetZusammen: true,
        gerichtlicheAlimentenregelung: false,
      };
    });

    it('has question not answered', () => {
      famSit.elternteilUnbekanntVerstorben = undefined;
      expect(step.getPrevious(famSit)).toEqual(
        FamiliensituationFormSteps.ALIMENTENREGELUNG
      );
      expect(step.getNext(famSit)).toEqual(
        FamiliensituationFormSteps.ELTERN_UNBEKANNT_VERSTORBEN
      );
    });
    it('has question answered true', () => {
      famSit.elternteilUnbekanntVerstorben = true;
      expect(step.getPrevious(famSit)).toEqual(
        FamiliensituationFormSteps.ALIMENTENREGELUNG
      );
      expect(step.getNext(famSit)).toEqual(
        FamiliensituationFormSteps.ELTERN_UNBEKANNT_VERSTORBEN
      );
    });
    it('has question answered false', () => {
      famSit.elternteilUnbekanntVerstorben = false;
      expect(step.getPrevious(famSit)).toEqual(
        FamiliensituationFormSteps.ALIMENTENREGELUNG
      );
      expect(step.getNext(famSit)).toEqual(
        FamiliensituationFormSteps.ZWEI_FAMILIENBUDGET
      );
    });
  });

  describe('Step "Zwei Familienbudgets"', () => {
    const step = FamiliensituationFormSteps.ZWEI_FAMILIENBUDGET;
    let famSit: FamiliensituationUpdate;

    beforeEach(() => {
      famSit = {
        elternVerheiratetZusammen: true,
        gerichtlicheAlimentenregelung: false,
        elternteilUnbekanntVerstorben: false,
      };
    });

    it('has question not answered', () => {
      famSit.elternteilUnbekanntVerstorben = undefined;
      expect(step.getPrevious(famSit)).toEqual(
        FamiliensituationFormSteps.ELTERN_UNBEKANNT_VERSTORBEN
      );
      expect(step.getNext(famSit)).toEqual(
        FamiliensituationFormSteps.ZWEI_FAMILIENBUDGET
      );
    });
    it('has question answered true', () => {
      famSit.elternteilUnbekanntVerstorben = true;
      expect(step.getPrevious(famSit)).toEqual(
        FamiliensituationFormSteps.ELTERN_UNBEKANNT_VERSTORBEN
      );
      expect(step.getNext(famSit)).toEqual(
        FamiliensituationFormSteps.ZWEI_FAMILIENBUDGET
      );
    });
    it('has question answered false', () => {
      famSit.elternteilUnbekanntVerstorben = false;
      expect(step.getPrevious(famSit)).toEqual(
        FamiliensituationFormSteps.ELTERN_UNBEKANNT_VERSTORBEN
      );
      expect(step.getNext(famSit)).toEqual(
        FamiliensituationFormSteps.ZWEI_FAMILIENBUDGET
      );
    });
  });
});
