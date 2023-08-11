import { MAT_FORM_FIELD_DEFAULT_OPTIONS } from '@angular/material/form-field';

export function provideMaterialDefaultOptions() {
  return [
    {
      provide: MAT_FORM_FIELD_DEFAULT_OPTIONS,
      useValue: {
        appearance: 'outline',
        floatLabel: 'always',
      },
    },
  ];
}
