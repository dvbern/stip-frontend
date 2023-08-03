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
 * Mark and make given properties undefined if empty string or null
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
      [key]:
        keys.includes(key) && (values[key] === '' || values[key] === null)
          ? undefined
          : values[key],
    }),
    {} as Omit<T, Keys[number]> & UndefinedIfEmptyRecord<Pick<T, Keys[number]>>
  );
};

type OnlyString<T> = T extends string ? T : never;

/**
 * This helper function can be used to obtain the non nullable required form values and convert empty
 * values to undefined.
 *
 * **required**
 * During form editing some values are nullable but in reality they are required, this methods should ensure
 * that these Values are also reflecting the reality during design-time
 *
 * **undefinedIfEmpty**
 * Some values should be given as undefined to the API instead of empty, this setting can be used to mark
 * the necessary properties
 *
 * Sadly it is requiered to specify again which form keys should be handled as **required** because there is
 * no information available about the used validators in a form during design-time.
 *
 * @throws Error if given properties have no `Validators.required` set
 * @param values The form values optained for example via `form.getRawValues()`
 * @param opts {
 *  required: a list of properties that should be handled as non-nullable,
 *  undefinedIfEmpty: a list of properties that should be converted to undefined if empty
 * }
 */
export function convertTempFormToRealValues<
  T extends {
    [K: string]: AbstractControl<unknown>;
  },
  K extends keyof T
>(
  form: FormGroup<T>,
  opts: {
    required?: OnlyString<K>[];
    undefinedIfEmpty?: OnlyString<K>[];
  }
) {
  const values = form.getRawValue();

  const invalidFieldConfig = opts.required?.find(
    (f) => !form.get(f)?.hasValidator(Validators.required)
  );
  if (invalidFieldConfig) {
    throw new Error(
      `Form control '${invalidFieldConfig}' has no Validators.required`
    );
  }

  return fromRequired(
    opts.undefinedIfEmpty
      ? undefinedIfEmpty(values, opts.undefinedIfEmpty)
      : values,
    opts.required ?? []
  );
}
