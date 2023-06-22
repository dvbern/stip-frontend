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
import { GesuchAppPatternGesuchStepLayoutComponent } from '@dv/gesuch-app/pattern/gesuch-step-layout';
import { MaskitoModule } from '@maskito/angular';
import { Store } from '@ngrx/store';
import { TranslateModule } from '@ngx-translate/core';
import { toSignal } from '@angular/core/rxjs-interop';

import { selectGesuchAppDataAccessGesuchsView } from '@dv/gesuch-app/data-access/gesuch';
import { GesuchAppEventGesuchFormFamiliensituation } from '@dv/gesuch-app/event/gesuch-form-familiensituation';
import { GesuchFormSteps } from '@dv/gesuch-app/model/gesuch-form';
import {
  ElternAbwesenheitsGrund,
  Elternschaftsteilung,
  ElternUnbekanntheitsGrund,
  FamiliensituationDTO,
  SharedModelGesuch,
} from '@dv/shared/model/gesuch';
import {
  SharedUiFormComponent,
  SharedUiFormLabelComponent,
  SharedUiFormLabelTargetDirective,
  SharedUiFormMessageComponent,
  SharedUiFormMessageErrorDirective,
} from '@dv/shared/ui/form';
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
    SharedUiFormComponent,
    SharedUiFormLabelComponent,
    SharedUiFormLabelTargetDirective,
    SharedUiFormMessageComponent,
    SharedUiFormMessageErrorDirective,
    GesuchAppPatternGesuchStepLayoutComponent,
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
    elternVerheiratetZusammen: [<boolean | null>null, [Validators.required]],
    gerichtlicheAlimentenregelung: [
      <boolean | null>null,
      [Validators.required],
    ],
    werZahltAlimente: ['', [Validators.required]],
    elternteilUnbekanntVerstorben: [
      <boolean | null>null,
      [Validators.required],
    ],
    mutterUnbekanntVerstorben: ['', [Validators.required]],
    vaterUnbekanntVerstorben: ['', [Validators.required]],
    mutterUnbekanntGrund: ['', [Validators.required]],
    vaterUnbekanntGrund: ['', [Validators.required]],
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
  }

  constructor() {
    Object.values(this.form.controls).forEach((control) => control.disable());
    this.form.controls.elternVerheiratetZusammen.enable();
    const elternVerheiratetZusammen$ = toSignal(
      this.form.controls.elternVerheiratetZusammen.valueChanges
    );
    const gerichtlicheAlimentenregelung$ = toSignal(
      this.form.controls.gerichtlicheAlimentenregelung.valueChanges
    );
    const werZahltAlimente$ = toSignal(
      this.form.controls.werZahltAlimente.valueChanges
    );
    const elternteilUnbekanntVerstorben$ = toSignal(
      this.form.controls.elternteilUnbekanntVerstorben.valueChanges
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

    // effect for gerichtlicheAlimentenregelung
    effect(
      () => {
        if (elternVerheiratetZusammen$() === true) {
          this.setInvisible(this.form.controls.gerichtlicheAlimentenregelung);
        }
        if (elternVerheiratetZusammen$() === false) {
          this.setVisible(this.form.controls.gerichtlicheAlimentenregelung);
        }
      },
      { allowSignalWrites: true }
    );

    // effect for werZahltAlimente
    effect(
      () => {
        const gerichtlicheAlimentenregelung = gerichtlicheAlimentenregelung$();
        if (gerichtlicheAlimentenregelung === true) {
          this.setVisible(this.form.controls.werZahltAlimente);
        } else {
          this.setInvisible(this.form.controls.werZahltAlimente);
        }
      },
      { allowSignalWrites: true }
    );

    effect(
      () => {
        const gerichtlicheAlimentenregelung = gerichtlicheAlimentenregelung$();
        if (gerichtlicheAlimentenregelung === false) {
          this.setVisible(this.form.controls.elternteilUnbekanntVerstorben);
        } else {
          this.setInvisible(this.form.controls.elternteilUnbekanntVerstorben);
        }
      },
      { allowSignalWrites: true }
    );

    effect(
      () => {
        const elternteilUnbekanntVerstorben = elternteilUnbekanntVerstorben$();
        if (elternteilUnbekanntVerstorben === true) {
          this.setVisible(this.form.controls.mutterUnbekanntVerstorben);
          this.setVisible(this.form.controls.vaterUnbekanntVerstorben);
        } else {
          this.setInvisible(this.form.controls.mutterUnbekanntVerstorben);
          this.setInvisible(this.form.controls.vaterUnbekanntVerstorben);
        }
      },
      { allowSignalWrites: true }
    );

    effect(
      () => {
        const vaterUnbekanntVerstorben = vaterVerstorbenUnbekannt$();
        if (vaterUnbekanntVerstorben === ElternAbwesenheitsGrund.UNBEKANNT) {
          this.setVisible(this.form.controls.vaterUnbekanntGrund);
        } else {
          this.setInvisible(this.form.controls.vaterUnbekanntGrund);
        }
      },
      { allowSignalWrites: true }
    );

    effect(
      () => {
        const mutterUnbekanntVerstorben = mutterVerstorbenUnbekannt$();
        if (mutterUnbekanntVerstorben === ElternAbwesenheitsGrund.UNBEKANNT) {
          this.setVisible(this.form.controls.mutterUnbekanntGrund);
        } else {
          this.setInvisible(this.form.controls.mutterUnbekanntGrund);
        }
      },
      { allowSignalWrites: true }
    );

    effect(
      () => {
        const elternteilUnbekanntVerstorben = elternteilUnbekanntVerstorben$();

        if (elternteilUnbekanntVerstorben === false) {
          this.setVisible(this.form.controls.sorgerecht);
          this.setVisible(this.form.controls.obhut);
        }
      },
      { allowSignalWrites: true }
    );

    effect(
      () => {
        const obhut = obhut$();

        if (obhut === Elternschaftsteilung.GEMEINSAM) {
          this.setVisible(this.form.controls.obhutVater);
          this.setVisible(this.form.controls.obhutMutter);
        } else {
          this.setInvisible(this.form.controls.obhutVater);
          this.setInvisible(this.form.controls.obhutMutter);
        }
      },
      { allowSignalWrites: true }
    );

    effect(
      () => {
        const sorgerecht = sorgerecht$();

        if (sorgerecht === Elternschaftsteilung.GEMEINSAM) {
          this.setVisible(this.form.controls.sorgerechtVater);
          this.setVisible(this.form.controls.sorgerechtMutter);
        } else {
          this.setInvisible(this.form.controls.sorgerechtVater);
          this.setInvisible(this.form.controls.sorgerechtMutter);
        }
      },
      { allowSignalWrites: true }
    );

    effect(
      () => {
        const zahltMutterAlimente =
          werZahltAlimente$() === Elternschaftsteilung.MUTTER;
        const vaterWederVerstorbenNochUnbekannt =
          vaterVerstorbenUnbekannt$() === ElternAbwesenheitsGrund.WEDER_NOCH;
        const elternAnwesend = elternteilUnbekanntVerstorben$() === false;

        if (
          zahltMutterAlimente ||
          vaterWederVerstorbenNochUnbekannt ||
          elternAnwesend
        ) {
          this.setVisible(this.form.controls.vaterWiederverheiratet);
        } else {
          this.setInvisible(this.form.controls.vaterWiederverheiratet);
        }
      },
      { allowSignalWrites: true }
    );

    effect(
      () => {
        const zahltVaterAlimente =
          werZahltAlimente$() === Elternschaftsteilung.VATER;
        const mutterWederVerstorbenNochUnbekannt =
          mutterVerstorbenUnbekannt$() === ElternAbwesenheitsGrund.WEDER_NOCH;
        const elternAnwesend = elternteilUnbekanntVerstorben$() === false;

        if (
          zahltVaterAlimente ||
          mutterWederVerstorbenNochUnbekannt ||
          elternAnwesend
        ) {
          this.setVisible(this.form.controls.mutterWiederverheiratet);
        } else {
          this.setInvisible(this.form.controls.mutterWiederverheiratet);
        }
      },
      { allowSignalWrites: true }
    );
  }

  handleSave(): void {
    this.form.markAllAsTouched();
    if (this.form.valid) {
      this.store.dispatch(
        GesuchAppEventGesuchFormFamiliensituation.saveTriggered({
          gesuch: this.buildSharedModelDTOFromForm(),
          origin: GesuchFormSteps.FAMILIENSITUATION,
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

  protected readonly GesuchFormSteps = GesuchFormSteps;
}
