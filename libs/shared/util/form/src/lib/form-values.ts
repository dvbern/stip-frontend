import { AbstractControl, FormGroup, Validators } from '@angular/forms';

type NonNullableRecord<T extends Record<string, unknown>> = {
  [K in keyof T]: NonNullable<T[K]>;
};
type UndefinedIfEmptyRecord<T extends Record<string, unknown>> = {
  [K in keyof T]: Exclude<T[K], null | ''> | undefined;
};

/**
 * Mark given properties as not null, only design time
 */
const fromRequired = <
  T extends { [k: string]: unknown },
  K extends keyof T,
  Keys extends K[] = K[]
>(
  values: T,
  // Keys are only used for the type information during design time
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  _keys: Keys
) => {
  return values as unknown as Omit<T, Keys[number]> &
    NonNullableRecord<Pick<T, Keys[number]>>;
};

/**
 * Mark and make given properties undefined if empty
 */
const undefinedIfEmpty = <
  T extends { [k: string]: unknown },
  K extends keyof T,
  Keys extends K[] = K[]
>(
  values: T,
  keys: Keys
) => {
  return (Object.keys(values) as K[]).reduce(
    (acc, key) => ({
      ...acc,
      [key]: keys.includes(key) ? values[key] || undefined : values[key],
    }),
    {} as Omit<T, Keys[number]> & UndefinedIfEmptyRecord<Pick<T, Keys[number]>>
  );
};

type OnlyString<T> = T extends string ? T : never;

/**
 * This helper function can be used to optain the non nullable required form values
 *
 * Sadly it is requiered to specify again which form keys should be handled as **required** because there is
 * no information available about the used validators in a form during design time.
 *
 * @throws Error if given properties have no `Validators.required` set
 * @param values The form values optained for example via `form.getRawValues()`
 * @param optsOrkeys Can be a list of `required` values or a combination of `required` & `undefined if empty`
 */
export function prepareFormValues<
  T extends {
    [K: string]: AbstractControl<unknown>;
  },
  K extends keyof T
>(
  form: FormGroup<T>,
  optsOrkeys:
    | {
        required?: OnlyString<K>[];
        undefinedIfEmpty?: OnlyString<K>[];
      }
    | OnlyString<K>[]
) {
  const values = form.getRawValue();
  const [requiredFields, undefinedFields] = Array.isArray(optsOrkeys)
    ? [optsOrkeys]
    : [optsOrkeys.required, optsOrkeys.undefinedIfEmpty];

  const invalidFieldConfig = requiredFields?.find(
    (f) => !form.get(f)?.hasValidator(Validators.required)
  );
  if (invalidFieldConfig) {
    throw new Error(
      `Form control '${invalidFieldConfig}' has no Validators.required`
    );
  }

  return fromRequired(
    undefinedFields ? undefinedIfEmpty(values, undefinedFields) : values,
    requiredFields ?? []
  );
}
