import { NonNullableFormBuilder, Validators } from '@angular/forms';
import { Wohnsitz } from '@dv/shared/model/gesuch';
import {
  numberToPercentString,
  percentStringToNumber,
} from '@dv/shared/ui/percentage-splitter';
import { unsetString } from '@dv/shared/util/form';

type WohnsitzAnteile<T extends string | number> = {
  wohnsitzAnteilVater?: T;
  wohnsitzAnteilMutter?: T;
};

export const addWohnsitzControls = (fb: NonNullableFormBuilder) => {
  return {
    wohnsitz: fb.control<Wohnsitz>('' as Wohnsitz, [Validators.required]),
    wohnsitzAnteilMutter: [unsetString, [Validators.required]],
    wohnsitzAnteilVater: [unsetString, [Validators.required]],
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
