import {
  FormControl,
  NonNullableFormBuilder,
  Validators,
} from '@angular/forms';
import { Wohnsitz } from '@dv/shared/model/gesuch';
import {
  numberToPercentString,
  percentStringToNumber,
} from '@dv/shared/ui/percentage-splitter';
import { SharedUtilFormService } from '@dv/shared/util/form';

type WohnsitzAnteile<T> = {
  wohnsitzAnteilVater: T;
  wohnsitzAnteilMutter: T;
};

export const addWohnsitzControls = (fb: NonNullableFormBuilder) => {
  return {
    wohnsitz: fb.control<Wohnsitz>('' as Wohnsitz, [Validators.required]),
    wohnsitzAnteilMutter: [
      <string | undefined>undefined,
      [Validators.required],
    ],
    wohnsitzAnteilVater: [<string | undefined>undefined, [Validators.required]],
  };
};

export function wohnsitzAnteileNumber(
  anteile: Partial<WohnsitzAnteile<string>>
) {
  return {
    wohnsitzAnteilMutter: percentStringToNumber(anteile.wohnsitzAnteilMutter),
    wohnsitzAnteilVater: percentStringToNumber(anteile.wohnsitzAnteilVater),
  };
}

export function wohnsitzAnteileString(
  anteile: Partial<WohnsitzAnteile<number>>
) {
  return {
    wohnsitzAnteilMutter: numberToPercentString(anteile.wohnsitzAnteilMutter),
    wohnsitzAnteilVater: numberToPercentString(anteile.wohnsitzAnteilVater),
  };
}

export function updateWohnsitzControlsState(
  formUtils: SharedUtilFormService,
  form: WohnsitzAnteile<FormControl>,
  disabled: boolean
) {
  formUtils.setDisabledState(form.wohnsitzAnteilVater, disabled, false);
  formUtils.setDisabledState(form.wohnsitzAnteilMutter, disabled, false);
}
