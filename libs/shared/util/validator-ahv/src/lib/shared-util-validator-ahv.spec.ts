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
    expect(sharedUtilValidatorAhv(mock)).toBe(null);
  });
  it('invalid ahv', () => {
    const mock = new FormControl('756.9217.0769.40');
    expect(sharedUtilValidatorAhv(mock)).toEqual({ ahv: true });
  });
});
