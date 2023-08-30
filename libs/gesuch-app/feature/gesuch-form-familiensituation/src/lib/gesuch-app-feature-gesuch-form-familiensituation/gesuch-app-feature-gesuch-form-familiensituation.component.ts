import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  effect,
  ElementRef,
  inject,
  OnInit,
} from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import {
  NonNullableFormBuilder,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatRadioModule } from '@angular/material/radio';
import { MatSelectModule } from '@angular/material/select';

import { selectGesuchAppDataAccessGesuchsView } from '@dv/gesuch-app/data-access/gesuch';
import { GesuchAppEventGesuchFormFamiliensituation } from '@dv/gesuch-app/event/gesuch-form-familiensituation';
import { GesuchFormSteps } from '@dv/gesuch-app/model/gesuch-form';
import { GesuchAppPatternGesuchStepLayoutComponent } from '@dv/gesuch-app/pattern/gesuch-step-layout';
import {
  numberToPercentString,
  percentStringToNumber,
  SharedUiPercentageSplitterComponent,
} from '@dv/shared/ui/percentage-splitter';
import { GesuchAppUiStepFormButtonsComponent } from '@dv/gesuch-app/ui/step-form-buttons';
import {
  ElternAbwesenheitsGrund,
  Elternschaftsteilung,
  ElternUnbekanntheitsGrund,
  GesuchFormularUpdate,
} from '@dv/shared/model/gesuch';
import {
  SharedUiFormFieldDirective,
  SharedUiFormMessageErrorDirective,
} from '@dv/shared/ui/form';
import { SharedUiProgressBarComponent } from '@dv/shared/ui/progress-bar';
import {
  convertTempFormToRealValues,
  SharedUtilFormService,
} from '@dv/shared/util/form';
import { MaskitoModule } from '@maskito/angular';
import { Store } from '@ngrx/store';
import { TranslateModule } from '@ngx-translate/core';
import { Subject } from 'rxjs';

@Component({
  selector: 'dv-gesuch-app-feature-gesuch-form-familiensituation',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    TranslateModule,
    MaskitoModule,
    MatFormFieldModule,
    MatRadioModule,
    MatSelectModule,
    SharedUiProgressBarComponent,
    SharedUiFormFieldDirective,
    SharedUiFormMessageErrorDirective,
    GesuchAppPatternGesuchStepLayoutComponent,
    SharedUiPercentageSplitterComponent,
    GesuchAppUiStepFormButtonsComponent,
  ],
  templateUrl:
    './gesuch-app-feature-gesuch-form-familiensituation.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class GesuchAppFeatureGesuchFormFamiliensituationComponent
  implements OnInit
{
  private elementRef = inject(ElementRef);
  private store = inject(Store);
  private formBuilder = inject(NonNullableFormBuilder);
  private formUtils = inject(SharedUtilFormService);

  readonly ELTERNSCHAFTSTEILUNG = Elternschaftsteilung;
  readonly ELTERN_ABWESENHEITS_GRUND = ElternAbwesenheitsGrund;
  readonly ELTERN_UNBEKANNTHEITS_GRUND = ElternUnbekanntheitsGrund;

  form = this.formBuilder.group({
    elternVerheiratetZusammen: [<boolean | null>null, [Validators.required]],
    gerichtlicheAlimentenregelung: [
      <boolean | null>null,
      [Validators.required],
    ],
    werZahltAlimente: this.formBuilder.control<
      Elternschaftsteilung | undefined
    >(undefined, { validators: Validators.required }),
    elternteilUnbekanntVerstorben: [
      <boolean | null>null,
      [Validators.required],
    ],
    mutterUnbekanntVerstorben: this.formBuilder.control<
      ElternAbwesenheitsGrund | undefined
    >(undefined, { validators: Validators.required }),
    vaterUnbekanntVerstorben: this.formBuilder.control<
      ElternAbwesenheitsGrund | undefined
    >(undefined, { validators: Validators.required }),
    mutterUnbekanntGrund: this.formBuilder.control<
      ElternUnbekanntheitsGrund | undefined
    >(undefined, { validators: Validators.required }),
    vaterUnbekanntGrund: this.formBuilder.control<
      ElternUnbekanntheitsGrund | undefined
    >(undefined, { validators: Validators.required }),
    vaterWiederverheiratet: [<boolean | null>null, [Validators.required]],
    mutterWiederverheiratet: [<boolean | null>null, [Validators.required]],
    sorgerecht: this.formBuilder.control<Elternschaftsteilung | undefined>(
      undefined,
      { validators: Validators.required }
    ),
    obhut: this.formBuilder.control<Elternschaftsteilung | undefined>(
      undefined,
      { validators: Validators.required }
    ),
    obhutMutter: ['', [Validators.required]],
    obhutVater: ['', [Validators.required]],
  });

  view = this.store.selectSignal(selectGesuchAppDataAccessGesuchsView);
  updateValidity$ = new Subject<unknown>();

  ngOnInit(): void {
    this.store.dispatch(GesuchAppEventGesuchFormFamiliensituation.init());
  }

  constructor() {
    Object.values(this.form.controls).forEach((control) => control.disable());
    const {
      elternVerheiratetZusammen,
      gerichtlicheAlimentenregelung,
      werZahltAlimente,
      elternteilUnbekanntVerstorben,
      vaterUnbekanntVerstorben,
      mutterUnbekanntVerstorben,
      obhut,
      vaterUnbekanntGrund,
      mutterUnbekanntGrund,
      mutterWiederverheiratet,
      obhutMutter,
      obhutVater,
      sorgerecht,
      vaterWiederverheiratet,
    } = this.form.controls;

    elternVerheiratetZusammen.enable();
    const elternVerheiratetZusammenSig = toSignal(
      elternVerheiratetZusammen.valueChanges
    );
    const gerichtlicheAlimentenregelungSig = toSignal(
      gerichtlicheAlimentenregelung.valueChanges
    );
    const werZahltAlimenteSig = toSignal(werZahltAlimente.valueChanges);
    const elternteilUnbekanntVerstorbenSig = toSignal(
      elternteilUnbekanntVerstorben.valueChanges
    );
    const vaterVerstorbenUnbekanntSig = toSignal(
      vaterUnbekanntVerstorben.valueChanges
    );
    const mutterVerstorbenUnbekanntSig = toSignal(
      mutterUnbekanntVerstorben.valueChanges
    );
    const obhutSig = toSignal(obhut.valueChanges);

    effect(
      () => {
        const { gesuchFormular } = this.view();
        if (gesuchFormular !== undefined) {
          const initialFormFamSit = gesuchFormular?.familiensituation ?? {};
          this.form.patchValue({
            ...initialFormFamSit,

            obhutMutter: numberToPercentString(
              gesuchFormular?.familiensituation?.obhutMutter
            ),
            obhutVater: numberToPercentString(
              gesuchFormular?.familiensituation?.obhutVater
            ),
          });
        }
      },
      { allowSignalWrites: true }
    );

    // effect for gerichtlicheAlimentenregelung
    effect(
      () => {
        this.formUtils.setDisabledState(
          gerichtlicheAlimentenregelung,
          elternVerheiratetZusammenSig() !== false,
          true
        );
      },
      { allowSignalWrites: true }
    );

    // effect for werZahltAlimente
    effect(
      () => {
        const gerichtlicheAlimentenregelung =
          gerichtlicheAlimentenregelungSig();

        this.formUtils.setDisabledState(
          werZahltAlimente,
          gerichtlicheAlimentenregelung !== true,
          true
        );
      },
      { allowSignalWrites: true }
    );

    effect(
      () => {
        const gerichtlicheAlimentenregelung =
          gerichtlicheAlimentenregelungSig();

        this.formUtils.setDisabledState(
          elternteilUnbekanntVerstorben,
          gerichtlicheAlimentenregelung !== false,
          true
        );
      },
      { allowSignalWrites: true }
    );

    effect(
      () => {
        const elternteilUnbekanntVerstorben =
          elternteilUnbekanntVerstorbenSig();
        this.formUtils.setDisabledState(
          mutterUnbekanntVerstorben,
          elternteilUnbekanntVerstorben !== true,
          true
        );
        this.formUtils.setDisabledState(
          vaterUnbekanntVerstorben,
          elternteilUnbekanntVerstorben !== true,
          true
        );
      },
      { allowSignalWrites: true }
    );

    effect(
      () => {
        const vaterUnbekanntVerstorben = vaterVerstorbenUnbekanntSig();
        this.formUtils.setDisabledState(
          vaterUnbekanntGrund,
          vaterUnbekanntVerstorben !== ElternAbwesenheitsGrund.UNBEKANNT,
          true
        );
      },
      { allowSignalWrites: true }
    );

    effect(
      () => {
        const mutterUnbekanntVerstorben = mutterVerstorbenUnbekanntSig();
        this.formUtils.setDisabledState(
          mutterUnbekanntGrund,
          mutterUnbekanntVerstorben !== ElternAbwesenheitsGrund.UNBEKANNT,
          true
        );
      },
      { allowSignalWrites: true }
    );

    effect(
      () => {
        const elternteilUnbekanntVerstorben =
          elternteilUnbekanntVerstorbenSig() ?? true;

        this.formUtils.setDisabledState(
          sorgerecht,
          !!elternteilUnbekanntVerstorben,
          true
        );
        this.formUtils.setDisabledState(
          obhut,
          !!elternteilUnbekanntVerstorben,
          true
        );
      },
      { allowSignalWrites: true }
    );

    effect(
      () => {
        const notGemeinsam = obhutSig() !== Elternschaftsteilung.GEMEINSAM;
        this.formUtils.setDisabledState(obhutVater, notGemeinsam, true);
        this.formUtils.setDisabledState(obhutMutter, notGemeinsam, true);
      },
      { allowSignalWrites: true }
    );

    effect(
      () => {
        const zahltMutterAlimente =
          werZahltAlimenteSig() === Elternschaftsteilung.MUTTER;
        const vaterWederVerstorbenNochUnbekannt =
          vaterVerstorbenUnbekanntSig() === ElternAbwesenheitsGrund.WEDER_NOCH;
        const elternAnwesend = elternteilUnbekanntVerstorbenSig() === false;
        const showVaterVerheiratedFrage =
          zahltMutterAlimente ||
          vaterWederVerstorbenNochUnbekannt ||
          elternAnwesend;

        this.formUtils.setDisabledState(
          vaterWiederverheiratet,
          !showVaterVerheiratedFrage,
          true
        );
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
        const showMutterVerheiratedFrage =
          zahltVaterAlimente ||
          mutterWederVerstorbenNochUnbekannt ||
          elternAnwesend;

        this.formUtils.setDisabledState(
          mutterWiederverheiratet,
          !showMutterVerheiratedFrage,
          true
        );
      },
      { allowSignalWrites: true }
    );
  }

  handleSave(): void {
    this.form.markAllAsTouched();
    this.formUtils.focusFirstInvalid(this.elementRef);
    this.updateValidity$.next({});
    const { gesuch } = this.view();
    if (this.form.valid && gesuch?.id) {
      const gesuchFormular = this.buildSharedModelAdresseFromForm();
      this.store.dispatch(
        GesuchAppEventGesuchFormFamiliensituation.saveTriggered({
          gesuchId: gesuch.id,
          gesuchFormular,
          origin: GesuchFormSteps.FAMILIENSITUATION,
        })
      );
    }
  }

  private buildSharedModelAdresseFromForm(): GesuchFormularUpdate {
    const { gesuchFormular } = this.view();
    return {
      ...(gesuchFormular ?? {}),
      familiensituation: {
        ...gesuchFormular?.familiensituation,
        ...convertTempFormToRealValues(this.form, [
          'elternVerheiratetZusammen',
          'gerichtlicheAlimentenregelung',
          'elternteilUnbekanntVerstorben',
          'vaterWiederverheiratet',
          'mutterWiederverheiratet',
        ]),
        // nicht form.value, sonst werden keine Werte auf null gesetzt!
        obhutVater: percentStringToNumber(this.form.getRawValue().obhutVater),
        obhutMutter: percentStringToNumber(this.form.getRawValue().obhutMutter),
      },
    };
  }

  protected readonly GesuchFormSteps = GesuchFormSteps;
}
