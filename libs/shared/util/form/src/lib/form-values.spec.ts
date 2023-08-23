import { FormBuilder, Validators } from '@angular/forms';
import { convertTempFormToRealValues } from './form-values';

describe('prepareFormValues', () => {
  const fb = new FormBuilder();
  it('should remove nullable type from form values', () => {
    const form = fb.nonNullable.group({
      a: [<string | null>null, [Validators.required]],
      b: [1],
    });
    form.controls.a.setValue('1 ');
    const values = convertTempFormToRealValues(form, ['a']);
    // Pseudo test, this code would trigger a syntax error if values.a is nullable
    expect(values.a.trim()).toBe('1');
  });
  it('should throw an error if no Validators.required is set', () => {
    const invalid = () =>
      convertTempFormToRealValues(
        fb.nonNullable.group({
          a: [1, []],
          b: ['', []],
        }),
        ['a']
      );
    expect(invalid).toThrow();
  });
});
