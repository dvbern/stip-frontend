import {
  ChangeDetectionStrategy,
  Component,
  effect,
  inject,
  OnInit,
} from '@angular/core';
import {
  AbstractControl,
  FormBuilder,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { CommonModule } from '@angular/common';
import { MaskitoModule } from '@maskito/angular';
import { Store } from '@ngrx/store';
import { TranslateModule } from '@ngx-translate/core';
import { toSignal } from '@angular/core/rxjs-interop';

import { selectGesuchAppDataAccessGesuchsView } from '@dv/gesuch-app/data-access/gesuch';
import { GesuchAppEventGesuchFormFamiliensituation } from '@dv/gesuch-app/event/gesuch-form-familiensituation';
import {
  GesuchFormSteps,
  NavigationType,
} from '@dv/gesuch-app/model/gesuch-form';
import {
  ElternAbwesenheitsGrund,
  Elternschaftsteilung,
  ElternUnbekanntheitsGrund,
  FamiliensituationDTO,
  SharedModelGesuch,
} from '@dv/shared/model/gesuch';
import {
  SharedUiFormFieldComponent,
  SharedUiFormLabelComponent,
  SharedUiFormLabelTargetDirective,
  SharedUiFormMessageComponent,
  SharedUiFormMessageErrorDirective,
} from '@dv/shared/ui/form-field';
import { SharedUiProgressBarComponent } from '@dv/shared/ui/progress-bar';

@Component({
  selector: 'dv-gesuch-app-feature-gesuch-form-familiensituation',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    TranslateModule,
    MaskitoModule,
    SharedUiProgressBarComponent,
    SharedUiFormFieldComponent,
    SharedUiFormLabelComponent,
    SharedUiFormLabelTargetDirective,
    SharedUiFormMessageComponent,
    SharedUiFormMessageErrorDirective,
  ],
  templateUrl:
    './gesuch-app-feature-gesuch-form-familiensituation.component.html',
  styleUrls: [
    './gesuch-app-feature-gesuch-form-familiensituation.component.scss',
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class GesuchAppFeatureGesuchFormFamiliensituationComponent
  implements OnInit
{
  private store = inject(Store);
  private formBuilder = inject(FormBuilder);

  readonly ELTERNSCHAFTSTEILUNG = Elternschaftsteilung;
  readonly ELTERN_ABWESENHEITS_GRUND = ElternAbwesenheitsGrund;
  readonly ELTERN_UNBEKANNTHEITS_GRUND = ElternUnbekanntheitsGrund;

  form = this.formBuilder.group({
    leiblicheElternVerheiratetKonkubinat: [
      <boolean | null>null,
      [Validators.required],
    ],
    gerichtlicheAlimentenregelung: [
      <boolean | null>null,
      [Validators.required],
    ],
    werZahltAlimente: ['', [Validators.required]],
    elternteilVerstorbenUnbekannt: [
      <boolean | null>null,
      [Validators.required],
    ],
    mutterUnbekanntVerstorben: ['', [Validators.required]],
    vaterUnbekanntVerstorben: ['', [Validators.required]],
    mutterUnbekanntReason: ['', [Validators.required]],
    vaterUnbekanntReason: ['', [Validators.required]],
    vaterWiederverheiratet: [<boolean | null>null, [Validators.required]],
    mutterWiederverheiratet: [<boolean | null>null, [Validators.required]],
    sorgerecht: ['', [Validators.required]],
    obhut: ['', [Validators.required]],
    obhutMutter: [<number | null>null, [Validators.required]],
    obhutVater: [<number | null>null, [Validators.required]],
    sorgerechtMutter: [<number | null>null, [Validators.required]],
    sorgerechtVater: [<number | null>null, [Validators.required]],
  });

  view = this.store.selectSignal(selectGesuchAppDataAccessGesuchsView);

  ngOnInit(): void {
    this.store.dispatch(GesuchAppEventGesuchFormFamiliensituation.init());
    Object.values(this.form.controls).forEach((control) => control.disable());
    this.form.controls.leiblicheElternVerheiratetKonkubinat.enable();
  }

  constructor() {
    const leiblicheElternVerheiratetKonkubinat$ = toSignal(
      this.form.controls.leiblicheElternVerheiratetKonkubinat.valueChanges
    );
    const gerichtlicheAlimentenregelung$ = toSignal(
      this.form.controls.gerichtlicheAlimentenregelung.valueChanges
    );
    const werZahltAlimente$ = toSignal(
      this.form.controls.werZahltAlimente.valueChanges
    );
    const elternteilVerstorbenUnbekannt$ = toSignal(
      this.form.controls.elternteilVerstorbenUnbekannt.valueChanges
    );
    const vaterVerstorbenUnbekannt$ = toSignal(
      this.form.controls.vaterUnbekanntVerstorben.valueChanges
    );
    const mutterVerstorbenUnbekannt$ = toSignal(
      this.form.controls.mutterUnbekanntVerstorben.valueChanges
    );
    const obhut$ = toSignal(this.form.controls.obhut.valueChanges);
    const sorgerecht$ = toSignal(this.form.controls.sorgerecht.valueChanges);

    effect(
      () => {
        const { gesuch } = this.view();
        if (gesuch !== undefined) {
          const initialFormFamSit =
            gesuch?.familiensituationContainer?.familiensituationSB || {};
          this.form.patchValue({ ...initialFormFamSit });
        }
      },
      { allowSignalWrites: true }
    );

    effect(
      () => {
        if (leiblicheElternVerheiratetKonkubinat$() === true) {
          this.setInvisible(this.form.controls.gerichtlicheAlimentenregelung);
        }
        if (leiblicheElternVerheiratetKonkubinat$() === false) {
          this.setVisible(this.form.controls.gerichtlicheAlimentenregelung);
        }
      },
      { allowSignalWrites: true }
    );

    effect(
      () => {
        if (gerichtlicheAlimentenregelung$() === true) {
          this.setVisible(this.form.controls.werZahltAlimente);
          this.setInvisible(this.form.controls.elternteilVerstorbenUnbekannt);
        } else if (gerichtlicheAlimentenregelung$() === false) {
          this.setVisible(this.form.controls.elternteilVerstorbenUnbekannt);
          this.setInvisible(this.form.controls.werZahltAlimente);
        } else {
          this.setInvisible(this.form.controls.werZahltAlimente);
          this.setInvisible(this.form.controls.elternteilVerstorbenUnbekannt);
        }
      },
      { allowSignalWrites: true }
    );

    effect(
      () => {
        if (werZahltAlimente$() === Elternschaftsteilung.MUTTER) {
          this.setVisible(this.form.controls.vaterWiederverheiratet);
          this.setInvisible(this.form.controls.mutterWiederverheiratet);
        } else if (werZahltAlimente$() === Elternschaftsteilung.VATER) {
          this.setVisible(this.form.controls.mutterWiederverheiratet);
          this.setInvisible(this.form.controls.vaterWiederverheiratet);
        } else {
          this.setInvisible(this.form.controls.mutterWiederverheiratet);
          this.setInvisible(this.form.controls.vaterWiederverheiratet);
        }
      },
      { allowSignalWrites: true }
    );

    effect(
      () => {
        if (elternteilVerstorbenUnbekannt$() === true) {
          this.setVisible(this.form.controls.vaterUnbekanntVerstorben);
          this.setVisible(this.form.controls.mutterUnbekanntVerstorben);
        } else if (elternteilVerstorbenUnbekannt$() === false) {
          this.setVisible(this.form.controls.vaterWiederverheiratet);
          this.setVisible(this.form.controls.mutterWiederverheiratet);
          this.setVisible(this.form.controls.sorgerecht);
          this.setVisible(this.form.controls.obhut);
          this.setInvisible(this.form.controls.vaterUnbekanntVerstorben);
          this.setInvisible(this.form.controls.mutterUnbekanntVerstorben);
        } else {
          this.setInvisible(this.form.controls.vaterWiederverheiratet);
          this.setInvisible(this.form.controls.mutterWiederverheiratet);
          this.setInvisible(this.form.controls.sorgerecht);
          this.setInvisible(this.form.controls.sorgerechtMutter);
          this.setInvisible(this.form.controls.sorgerechtVater);
          this.setInvisible(this.form.controls.obhut);
          this.setInvisible(this.form.controls.vaterUnbekanntVerstorben);
          this.setInvisible(this.form.controls.mutterUnbekanntVerstorben);
        }
      },
      { allowSignalWrites: true }
    );

    effect(
      () => {
        if (
          vaterVerstorbenUnbekannt$() === ElternAbwesenheitsGrund.WEDER_NOCH
        ) {
          this.setVisible(this.form.controls.vaterWiederverheiratet);
          this.setInvisible(this.form.controls.vaterUnbekanntReason);
        } else if (
          vaterVerstorbenUnbekannt$() === ElternAbwesenheitsGrund.UNBEKANNT
        ) {
          this.setVisible(this.form.controls.vaterUnbekanntReason);
          this.setInvisible(this.form.controls.vaterWiederverheiratet);
        } else {
          this.setInvisible(this.form.controls.vaterWiederverheiratet);
          this.setInvisible(this.form.controls.vaterUnbekanntReason);
        }
      },
      { allowSignalWrites: true }
    );

    effect(
      () => {
        if (
          mutterVerstorbenUnbekannt$() === ElternAbwesenheitsGrund.WEDER_NOCH
        ) {
          this.setVisible(this.form.controls.mutterWiederverheiratet);
          this.setInvisible(this.form.controls.mutterUnbekanntReason);
        } else if (
          mutterVerstorbenUnbekannt$() === ElternAbwesenheitsGrund.UNBEKANNT
        ) {
          this.setVisible(this.form.controls.mutterUnbekanntReason);
          this.setInvisible(this.form.controls.mutterWiederverheiratet);
        } else {
          this.setInvisible(this.form.controls.mutterUnbekanntReason);
          this.setInvisible(this.form.controls.mutterWiederverheiratet);
        }
      },
      { allowSignalWrites: true }
    );

    effect(() => {
      if (obhut$() === Elternschaftsteilung.GEMEINSAM) {
        this.setVisible(this.form.controls.obhutVater);
        this.setVisible(this.form.controls.obhutMutter);
      } else {
        this.setInvisible(this.form.controls.obhutVater);
        this.setInvisible(this.form.controls.obhutMutter);
      }
    });

    effect(() => {
      if (sorgerecht$() === Elternschaftsteilung.GEMEINSAM) {
        this.setVisible(this.form.controls.sorgerechtVater);
        this.setVisible(this.form.controls.sorgerechtMutter);
      } else {
        this.setInvisible(this.form.controls.sorgerechtVater);
        this.setInvisible(this.form.controls.sorgerechtMutter);
      }
    });
  }

  handleSaveAndContinue(): void {
    this.form.markAllAsTouched();
    if (this.form.valid) {
      this.store.dispatch(
        GesuchAppEventGesuchFormFamiliensituation.nextStepTriggered({
          gesuch: this.buildSharedModelDTOFromForm(),
          origin: GesuchFormSteps.FAMILIENSITUATION,
          navigationType: NavigationType.FORWARDS,
        })
      );
    }
  }

  public handleSaveAndBack(): void {
    if (this.form.valid) {
      this.store.dispatch(
        GesuchAppEventGesuchFormFamiliensituation.prevStepTriggered({
          gesuch: this.buildSharedModelDTOFromForm(),
          origin: GesuchFormSteps.FAMILIENSITUATION,
          navigationType: NavigationType.BACKWARDS,
        })
      );
    }
  }

  private buildSharedModelDTOFromForm(): Partial<SharedModelGesuch> {
    const { gesuch } = this.view();
    const formPart = {} as FamiliensituationDTO;
    return {
      ...gesuch,
      familiensituationContainer: {
        ...gesuch?.familiensituationContainer,
        familiensituationSB: {
          ...formPart,
          ...gesuch?.familiensituationContainer?.familiensituationSB,
          ...this.form.value,
        },
      },
    } as Partial<SharedModelGesuch>;
  }

  private setInvisible(control: AbstractControl): void {
    control.patchValue(null);
    control.disable();
  }

  private setVisible(control: AbstractControl): void {
    control.enable();
  }
}
