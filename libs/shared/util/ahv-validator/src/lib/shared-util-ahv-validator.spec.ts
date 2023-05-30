import { FormControl } from '@angular/forms';

import {
  sharedUtilAhvValidator,
  sharedUtilIsValidAhv,
} from './shared-util-ahv-validator';

describe('sharedUtilIsValidAhv', () => {
  it('valid ahv', () => {
    expect(sharedUtilIsValidAhv('756.9217.0769.85')).toBe(true);
  });
  it('invalid ahv', () => {
    expect(sharedUtilIsValidAhv('756.9217.0769.40')).toBe(false);
  });
});

describe('sharedUtilAhvValidator', () => {
  it('valid ahv', () => {
    const mock = new FormControl('756.9217.0769.85');
    expect(sharedUtilAhvValidator(mock)).toBe(null);
  });
  it('invalid ahv', () => {
    const mock = new FormControl('756.9217.0769.40');
    expect(sharedUtilAhvValidator(mock)).toEqual({ ahv: true });
  });
});
