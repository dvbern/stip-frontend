# shared-util-validator-range

Custom Angular Form Validator that requires the control's value to be greater than or equal to
the provided max number and to be less than or equal to the provided min number.

This validator uses the default Angular Validators [min](https://angular.io/api/forms/Validators#min)
and [max](https://angular.io/api/forms/Validators#max) with their respective errors.

```typescript
import { sharedUtilValidatorRange } from './shared-util-validator-range';

const invalidMin = new FormControl(-1, sharedUtilValidatorRange(0, 5));
console.log(invalidMin.errors); // {range: {min: {min: 0, actual: -1}}}

const invalidMax = new FormControl(6, sharedUtilValidatorRange(0, 5));
console.log(invalidMax.errors); // {range: {max: {max: 5, actual: 6}}}
```

## Running unit tests

Run `nx test shared-util-validator-range` to execute the unit tests.
