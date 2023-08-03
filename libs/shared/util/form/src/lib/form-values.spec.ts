import { FormBuilder, Validators } from '@angular/forms';
import { prepareFormValues } from './form-values';

describe('prepareFormValues', () => {
  const fb = new FormBuilder();
  it('should remove nullable type from form values', () => {
    const form = fb.nonNullable.group({
      a: [<string | null>null, [Validators.required]],
      b: [1],
    });
    form.controls.a.setValue('1 ');
    const values = prepareFormValues(form, {
      required: ['a'],
    });
    expect(values.a.trim()).toBe('1');
  });
  it('should transform empty string to undefined', () => {
    const values = prepareFormValues(
      fb.nonNullable.group({
        a: [1, []],
        b: ['', []],
      }),
      {
        undefinedIfEmpty: ['b'],
      }
    );
    expect(values.b).toBe(undefined);
  });
  it('should throw an error if no Validators.required is set', () => {
    const invalid = () =>
      prepareFormValues(
        fb.nonNullable.group({
          a: [1, []],
          b: ['', []],
        }),
        ['a']
      );
    expect(invalid).toThrow();
  });
});
