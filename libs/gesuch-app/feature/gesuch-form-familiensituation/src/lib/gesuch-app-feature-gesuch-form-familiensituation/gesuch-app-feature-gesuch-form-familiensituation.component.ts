import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  effect,
  inject,
  OnInit,
} from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import {
  AbstractControl,
  FormBuilder,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';

import { selectGesuchAppDataAccessGesuchsView } from '@dv/gesuch-app/data-access/gesuch';
import { GesuchAppEventGesuchFormFamiliensituation } from '@dv/gesuch-app/event/gesuch-form-familiensituation';
import { GesuchFormSteps } from '@dv/gesuch-app/model/gesuch-form';
import { GesuchAppPatternGesuchStepLayoutComponent } from '@dv/gesuch-app/pattern/gesuch-step-layout';
import { GesuchAppUiPercentageSplitterComponent } from '@dv/gesuch-app/ui/percentage-splitter';
import { GesuchAppUiStepFormButtonsComponent } from '@dv/gesuch-app/ui/step-form-buttons';
import {
  ElternAbwesenheitsGrund,
  Elternschaftsteilung,
  ElternUnbekanntheitsGrund,
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
import { MaskitoModule } from '@maskito/angular';
import { Store } from '@ngrx/store';
import { TranslateModule } from '@ngx-translate/core';

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
    GesuchAppUiPercentageSplitterComponent,
    GesuchAppUiStepFormButtonsComponent,
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
    obhutMutter: ['', [Validators.required]],
    obhutVater: ['', [Validators.required]],
  });

  view = this.store.selectSignal(selectGesuchAppDataAccessGesuchsView);

  ngOnInit(): void {
    this.store.dispatch(GesuchAppEventGesuchFormFamiliensituation.init());
  }

  constructor() {
    Object.values(this.form.controls).forEach((control) => control.disable());
    this.form.controls.elternVerheiratetZusammen.enable();
    const elternVerheiratetZusammenSig = toSignal(
      this.form.controls.elternVerheiratetZusammen.valueChanges
    );
    const gerichtlicheAlimentenregelungSig = toSignal(
      this.form.controls.gerichtlicheAlimentenregelung.valueChanges
    );
    const werZahltAlimenteSig = toSignal(
      this.form.controls.werZahltAlimente.valueChanges
    );
    const elternteilUnbekanntVerstorbenSig = toSignal(
      this.form.controls.elternteilUnbekanntVerstorben.valueChanges
    );
    const vaterVerstorbenUnbekanntSig = toSignal(
      this.form.controls.vaterUnbekanntVerstorben.valueChanges
    );
    const mutterVerstorbenUnbekanntSig = toSignal(
      this.form.controls.mutterUnbekanntVerstorben.valueChanges
    );
    const obhutSig = toSignal(this.form.controls.obhut.valueChanges);

    effect(
      () => {
        const { gesuch } = this.view();
        if (gesuch !== undefined) {
          const initialFormFamSit =
            gesuch?.familiensituationContainer?.familiensituationSB || {};
          this.form.patchValue({
            ...initialFormFamSit,

            obhutMutter:
              GesuchAppUiPercentageSplitterComponent.numberToPercentString(
                gesuch?.familiensituationContainer?.familiensituationSB
                  ?.obhutMutter
              ),
            obhutVater:
              GesuchAppUiPercentageSplitterComponent.numberToPercentString(
                gesuch?.familiensituationContainer?.familiensituationSB
                  ?.obhutVater
              ),
          });
        }
      },
      { allowSignalWrites: true }
    );

    // effect for gerichtlicheAlimentenregelung
    effect(
      () => {
        if (elternVerheiratetZusammenSig() === true) {
          this.setInvisible(this.form.controls.gerichtlicheAlimentenregelung);
        }
        if (elternVerheiratetZusammenSig() === false) {
          this.setVisible(this.form.controls.gerichtlicheAlimentenregelung);
        }
      },
      { allowSignalWrites: true }
    );

    // effect for werZahltAlimente
    effect(
      () => {
        const gerichtlicheAlimentenregelung =
          gerichtlicheAlimentenregelungSig();
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
        const gerichtlicheAlimentenregelung =
          gerichtlicheAlimentenregelungSig();
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
        const elternteilUnbekanntVerstorben =
          elternteilUnbekanntVerstorbenSig();
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
        const vaterUnbekanntVerstorben = vaterVerstorbenUnbekanntSig();
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
        const mutterUnbekanntVerstorben = mutterVerstorbenUnbekanntSig();
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
        const elternteilUnbekanntVerstorben =
          elternteilUnbekanntVerstorbenSig();

        if (elternteilUnbekanntVerstorben === false) {
          this.setVisible(this.form.controls.sorgerecht);
          this.setVisible(this.form.controls.obhut);
        }
      },
      { allowSignalWrites: true }
    );

    effect(
      () => {
        const obhut = obhutSig();

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

    GesuchAppUiPercentageSplitterComponent.setupPercentDependencies(
      this.form.controls.obhutMutter,
      this.form.controls.obhutVater
    );

    effect(
      () => {
        const zahltMutterAlimente =
          werZahltAlimenteSig() === Elternschaftsteilung.MUTTER;
        const vaterWederVerstorbenNochUnbekannt =
          vaterVerstorbenUnbekanntSig() === ElternAbwesenheitsGrund.WEDER_NOCH;
        const elternAnwesend = elternteilUnbekanntVerstorbenSig() === false;

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
          werZahltAlimenteSig() === Elternschaftsteilung.VATER;
        const mutterWederVerstorbenNochUnbekannt =
          mutterVerstorbenUnbekanntSig() === ElternAbwesenheitsGrund.WEDER_NOCH;
        const elternAnwesend = elternteilUnbekanntVerstorbenSig() === false;

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

  private buildSharedModelDTOFromForm(): SharedModelGesuch {
    const { gesuch } = this.view();
    const updatedGesuch = {
      ...gesuch,
      familiensituationContainer: {
        ...gesuch?.familiensituationContainer,
        familiensituationSB: {
          ...gesuch?.familiensituationContainer?.familiensituationSB,
          ...this.form.getRawValue(), // nicht form.value, sonst werden keine Werte auf null gesetzt!
          obhutVater:
            GesuchAppUiPercentageSplitterComponent.percentStringToNumber(
              this.form.getRawValue().obhutVater
            ),
          obhutMutter:
            GesuchAppUiPercentageSplitterComponent.percentStringToNumber(
              this.form.getRawValue().obhutMutter
            ),
        },
      },
    } as SharedModelGesuch;

    return updatedGesuch;
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
