import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';
import { SharedModelGesuchFormular } from '@dv/shared/model/gesuch';
import { sharedUtilFnTypeGuardsIsDefined } from '@dv/shared/util-fn/type-guards';

const START_DIGITS = '756';
type FieldsWithSV = Extract<
  keyof SharedModelGesuchFormular,
  'personInAusbildung' | 'elterns' | 'partner'
>;

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

  const startDigits = ahv.slice(0, 3);

  return checkDigit === calculatedCheckDigit && startDigits === START_DIGITS;
}

export function sharedUtilIsUniqueAhv(
  ahv: string,
  type: FieldsWithSV,
  gesuchFormular: SharedModelGesuchFormular
) {
  const svNummers: Record<FieldsWithSV, (string | undefined)[]> = {
    personInAusbildung: [
      gesuchFormular.personInAusbildung?.sozialversicherungsnummer,
    ],
    partner: [gesuchFormular.partner?.sozialversicherungsnummer],
    elterns: (gesuchFormular.elterns ?? []).map(
      (e) => e.sozialversicherungsnummer
    ),
  };
  delete svNummers[type];

  const list = Object.values(svNummers)
    .flatMap((x) => x)
    .filter(sharedUtilFnTypeGuardsIsDefined);
  list.push(ahv);
  return new Set(list).size === list.length;
}

export function sharedUtilValidatorAhv(
  type: FieldsWithSV,
  gesuchFormular: SharedModelGesuchFormular
): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    if (!control?.value) {
      return null;
    } else {
      const uniqueCheck = sharedUtilIsUniqueAhv(
        control.value,
        type,
        gesuchFormular
      )
        ? null
        : { notUniqueAhv: true };
      return sharedUtilIsValidAhv(control.value)
        ? uniqueCheck
        : { ahv: true, ...(uniqueCheck ?? {}) };
    }
  };
}
