import { FormControl, ValidationErrors } from '@angular/forms';
import { sharedUtilValidatorRange } from './shared-util-validator-range';

describe('SharedUtilValidatorRangeService', () => {
  const min = 0;
  const max = 5;
  const control = new FormControl(null);

  it('should not have an error if no value is present', () => {
    control.setValue(null);
    expect(runValidation(min, max, control)).toBeNull();
  });

  it('should have notANumber error if a NaN-text', () => {
    control.setValue('hi');
    expect(Number('hi')).toBeNaN();
    expect(runValidation(min, max, control)).toEqual({ notANumber: true });
  });

  it('should not have outOfRange error if number equal to min is provided', () => {
    control.setValue(min);
    expect(runValidation(min, max, control)).toBeNull();
  });

  it('should not have outOfRange error if number equal to max is provided', () => {
    control.setValue(max);
    expect(runValidation(min, max, control)).toBeNull();
  });

  it('should not have outOfRange error if number between min and max is provided', () => {
    control.setValue(3);
    expect(runValidation(min, max, control)).toBeNull();
  });

  it('should have outOfRange error if number lower than min is provided', () => {
    const tooLow = -1;
    control.setValue(tooLow);
    const result = runValidation(min, max, control);
    expect(result).not.toBeNull();
    expect(result).toEqual({ range: { min: { actual: tooLow, min } } });
  });

  it('should have outOfRange error if number larger than max is provided', () => {
    const tooLarge = 6;
    control.setValue(tooLarge);
    const result = runValidation(min, max, control);
    expect(result).not.toBeNull();
    expect(result).toEqual({ range: { max: { actual: tooLarge, max } } });
  });
});

function runValidation(
  min: number,
  max: number,
  control: FormControl
): ValidationErrors {
  return sharedUtilValidatorRange(min, max)(control);
}
