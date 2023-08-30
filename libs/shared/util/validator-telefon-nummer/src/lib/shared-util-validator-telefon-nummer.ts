import {
  AbstractControl,
  FormControl,
  ValidationErrors,
  ValidatorFn,
} from '@angular/forms';
import { getNumberType, isValidPhoneNumber, parse } from 'libphonenumber-js';

export function sharedUtilIsValidTelefonNummer(telefonnummer: string) {
  let validNumber = false;
  if (!telefonnummer) {
    return null;
  }
  if (isMobileNumber(telefonnummer)) {
    validNumber = isMobileNumber(telefonnummer);
  } else {
    validNumber = isValidPhoneNumber(telefonnummer, 'CH');
  }
  return validNumber;
}

export function isMobileNumber(telefonnummer: string): boolean {
  const parsedNumber = parse(telefonnummer, 'CH');
  const type = getNumberType(parsedNumber);
  return type === 'MOBILE' || type === 'FIXED_LINE_OR_MOBILE';
}

export function sharedUtilValidatorTelefonNummer(): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    console.log('validating phone number: ' + control?.value);
    if (!control?.value) {
      return null;
    } else {
      return sharedUtilIsValidTelefonNummer(control.value)
        ? null
        : { telefonnummer: true };
    }
  };
}
