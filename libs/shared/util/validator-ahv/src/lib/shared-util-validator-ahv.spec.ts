import { FormControl } from '@angular/forms';

import {
  sharedUtilValidatorAhv,
  sharedUtilIsValidAhv,
} from './shared-util-validator-ahv';

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
    const mock = new FormControl('756.9217.0769.85');
    expect(sharedUtilValidatorAhv('personInAusbildung', {})(mock)).toBe(null);
  });
  it('invalid ahv', () => {
    const mock = new FormControl('756.9217.0769.40');
    expect(sharedUtilValidatorAhv('personInAusbildung', {})(mock)).toEqual({
      ahv: true,
    });
  });

  it('unique ahv', () => {
    const mock = new FormControl('756.9217.0769.85');
    expect(
      sharedUtilValidatorAhv('partner', {
        personInAusbildung: {
          sozialversicherungsnummer: '756.1111.1111.13',
        } as any,
      })(mock)
    ).toBe(null);
  });

  it('unique ahv with same field', () => {
    const mock = new FormControl('756.9217.0769.85');
    expect(
      sharedUtilValidatorAhv('partner', {
        partner: {
          sozialversicherungsnummer: mock.value,
        } as any,
      })(mock)
    ).toBe(null);
  });

  it('not unique ahv', () => {
    const mock = new FormControl('756.9217.0769.85');
    expect(
      sharedUtilValidatorAhv('partner', {
        personInAusbildung: { sozialversicherungsnummer: mock.value } as any,
      })(mock)
    ).toEqual({
      notUniqueAhv: true,
    });
  });
});
