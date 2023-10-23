import { FormControl } from '@angular/forms';

import {
  sharedUtilValidatorAhv,
  sharedUtilIsValidAhv,
} from './shared-util-validator-ahv';
import { ElternTyp } from '@dv/shared/model/gesuch';

describe('sharedUtilIsValidAhv', () => {
  it('valid ahv', () => {
    expect(sharedUtilIsValidAhv('756.9217.0769.85')).toBe(true);
  });
  it('invalid ahv', () => {
    expect(sharedUtilIsValidAhv('756.9217.0769.40')).toBe(false);
  });
  it('invalid start digits ahv', () => {
    expect(sharedUtilIsValidAhv('125.1000.0000.05')).toBe(false);
  });
});

describe('sharedUtilAhvValidator', () => {
  it('valid ahv', () => {
    const mock = new FormControl('756.9217.0769.85', { nonNullable: true });
    expect(sharedUtilValidatorAhv('personInAusbildung', {})(mock)).toBe(null);
  });
  it('invalid ahv', () => {
    const mock = new FormControl('756.9217.0769.40', { nonNullable: true });
    expect(sharedUtilValidatorAhv('personInAusbildung', {})(mock)).toEqual({
      ahv: true,
    });
  });

  it('unique ahv', () => {
    const mock = new FormControl('756.9217.0769.85', { nonNullable: true });
    expect(
      sharedUtilValidatorAhv('partner', {
        personInAusbildung: {
          sozialversicherungsnummer: '756.1111.1111.13',
        } as any,
      })(mock)
    ).toBe(null);
  });

  it('unique ahv if editing same field - parter', () => {
    const mock = new FormControl('756.9217.0769.85', { nonNullable: true });
    expect(
      sharedUtilValidatorAhv('partner', {
        partner: {
          sozialversicherungsnummer: mock.value,
        } as any,
      })(mock)
    ).toBe(null);
  });

  it('not unique ahv - partner / person', () => {
    const mock = new FormControl('756.9217.0769.85', { nonNullable: true });
    expect(
      sharedUtilValidatorAhv('partner', {
        personInAusbildung: { sozialversicherungsnummer: mock.value } as any,
      })(mock)
    ).toEqual({
      notUniqueAhv: true,
    });
  });

  it('not unique ahv - vater / mutter', () => {
    const mock = new FormControl('756.9217.0769.85', { nonNullable: true });
    expect(
      sharedUtilValidatorAhv('elternMutter', {
        elterns: [
          { elternTyp: ElternTyp.VATER, sozialversicherungsnummer: mock.value },
        ] as any,
      })(mock)
    ).toEqual({
      notUniqueAhv: true,
    });
  });

  it('unique ahv - mutter / mutter', () => {
    const mock = new FormControl('756.9217.0769.85', { nonNullable: true });
    expect(
      sharedUtilValidatorAhv('elternMutter', {
        elterns: [
          {
            elternTyp: ElternTyp.VATER,
            sozialversicherungsnummer: '756.1111.1111.13',
          },
        ] as any,
      })(mock)
    ).toEqual(null);
  });

  it('unique ahv if editing same field - vater', () => {
    const mock = new FormControl('756.9217.0769.85', { nonNullable: true });
    expect(
      sharedUtilValidatorAhv('elternVater', {
        elterns: [
          {
            elternTyp: ElternTyp.MUTTER,
            sozialversicherungsnummer: '756.1111.1111.13',
          },
          { elternTyp: ElternTyp.VATER, sozialversicherungsnummer: mock.value },
        ] as any,
      })(mock)
    ).toEqual(null);
  });
});
