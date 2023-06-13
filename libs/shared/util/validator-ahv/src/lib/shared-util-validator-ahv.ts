import { FormControl, ValidationErrors } from '@angular/forms';

// https://www.sozialversicherungsnummer.ch/aufbau-neu.htm

export function sharedUtilIsValidAhv(ahv: string) {
  const digits = ahv
    .replace(/\./g, '')
    .split('')
    .map((digit) => parseInt(digit, 10));

  if (digits.length !== 13) {
    return false;
  }

  const relevantDigits = digits.slice(0, 12).reverse();

  const relevantDigitsSum = relevantDigits.reduce((total, next, index) => {
    const multiplier = index % 2 === 0 ? 3 : 1;
    return total + next * multiplier;
  }, 0);

  const relevantDigitsRounded = Math.ceil(relevantDigitsSum / 10) * 10;
  const calculatedCheckDigit = relevantDigitsRounded - relevantDigitsSum;
  const checkDigit = digits[12];

  return checkDigit === calculatedCheckDigit;
}

export function sharedUtilValidatorAhv(
  control: FormControl
): ValidationErrors | null {
  if (!control?.value) {
    return null;
  } else {
    return sharedUtilIsValidAhv(control.value) ? null : { ahv: true };
  }
}
