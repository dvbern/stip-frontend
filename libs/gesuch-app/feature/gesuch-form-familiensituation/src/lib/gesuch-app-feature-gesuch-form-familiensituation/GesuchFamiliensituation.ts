import { FormControl } from '@angular/forms';

export interface GesuchFamiliensituation {
  leiblicheElternVerheiratetKonkubinat: FormControl<boolean | null>;
  gerichtlicheAlimentenregelung: FormControl<boolean | null>;
  werZahltAlimente: FormControl<string | null>;
  elternteilVerstorbenUnbekannt: FormControl<boolean | null>;
  elternteilVerstorben: FormControl<boolean | null>;
  mutterTotVerstorben: FormControl<boolean | null>;
  vaterTotVerstorben: FormControl<boolean | null>;
  mutterUnbekanntReason: FormControl<string | null>;
  vaterUnbekanntReason: FormControl<string | null>;
  vaterWiederverheiratet: FormControl<boolean | null>;
  mutterWiederverheiratet: FormControl<boolean | null>;
  sorgerecht: FormControl<string | null>;
  obhut: FormControl<boolean | null>;
  obhutMutter: FormControl<boolean | null>;
  obhutVater: FormControl<boolean | null>;
}
