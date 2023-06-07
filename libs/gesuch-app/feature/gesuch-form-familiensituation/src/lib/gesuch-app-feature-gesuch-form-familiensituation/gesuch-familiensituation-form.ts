import { FormControl } from '@angular/forms';
import {
  ElternAbwesenheitsGrund,
  Elternschaftsteilung,
  ElternUnbekanntheitsGrund,
} from '@dv/shared/model/gesuch';

export interface GesuchFamiliensituationForm {
  leiblicheElternVerheiratetKonkubinat: FormControl<boolean | null>;
  gerichtlicheAlimentenregelung: FormControl<boolean | null>;
  werZahltAlimente: FormControl<string | null>;
  elternteilVerstorbenUnbekannt: FormControl<boolean | null>;
  elternteilVerstorben: FormControl<boolean | null>;
  mutterUnbekanntVerstorben: FormControl<ElternAbwesenheitsGrund | null>;
  vaterUnbekanntVerstorben: FormControl<ElternAbwesenheitsGrund | null>;
  mutterUnbekanntReason: FormControl<ElternUnbekanntheitsGrund | null>;
  vaterUnbekanntReason: FormControl<ElternUnbekanntheitsGrund | null>;
  vaterWiederverheiratet: FormControl<boolean | null>;
  mutterWiederverheiratet: FormControl<boolean | null>;
  sorgerecht: FormControl<Elternschaftsteilung | null>;
  obhut: FormControl<Elternschaftsteilung | null>;
  obhutMutter: FormControl<number | null>;
  obhutVater: FormControl<number | null>;
}
