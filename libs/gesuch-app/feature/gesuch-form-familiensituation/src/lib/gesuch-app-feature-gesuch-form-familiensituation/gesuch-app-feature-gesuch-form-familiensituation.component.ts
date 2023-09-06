// noinspection PointlessBooleanExpressionJS

import {
  animate,
  state,
  style,
  transition,
  trigger,
} from '@angular/animations';
import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  effect,
  ElementRef,
  inject,
  OnInit,
  signal,
  WritableSignal,
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
import { GesuchAppUiStepperNavigationComponent } from '@dv/gesuch-app/ui/stepper-navigation';
import { MaskitoModule } from '@maskito/angular';
import { Store } from '@ngrx/store';
import { TranslateModule } from '@ngx-translate/core';
import { Subject } from 'rxjs';
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
import {
  FamiliensituationFormStep,
  FamiliensituationFormSteps,
} from './familiensituation-form-steps';

type FamSitStepMeta = {
  [P in keyof FamiliensituationFormSteps]?: FamSitAnimationState;
};
type FamSitAnimationState = 'in' | 'right' | 'left' | 'hidden';

const animationTime = 500;

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
    GesuchAppUiStepperNavigationComponent,
  ],
  templateUrl:
    './gesuch-app-feature-gesuch-form-familiensituation.component.html',
  styleUrls: [
    './gesuch-app-feature-gesuch-form-familiensituation.component.scss',
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  animations: [
    trigger('inOutPaneAnimation', [
      state('in', style({ position: 'relative', left: 0, right: 0 })),
      state('right', style({ left: '100%', display: 'none' })),
      state('left', style({ left: '-100%', display: 'none' })),
      state(
        'hidden',
        style({ position: 'absolute', left: '100%', display: 'none' })
      ),
      transition('void => *', []),
      transition('* => *', [animate(`${animationTime}ms ease-in`)]),
    ]),
  ],
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
      <boolean | undefined>undefined,
      [Validators.required],
    ],
    werZahltAlimente: this.formBuilder.control<
      Elternschaftsteilung | undefined
    >(undefined, { validators: Validators.required }),
    elternteilUnbekanntVerstorben: [
      <boolean | undefined>undefined,
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
    vaterWiederverheiratet: [
      <boolean | undefined>undefined,
      [Validators.required],
    ],
    mutterWiederverheiratet: [
      <boolean | undefined>undefined,
      [Validators.required],
    ],
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
  stateSig: WritableSignal<FamSitStepMeta> = signal({
    ELTERN_VERHEIRATET_ZUSAMMEN: 'in',
    ALIMENTENREGELUNG: 'right',
  });
  private currentFamiliensituationFormStep =
    FamiliensituationFormSteps.ELTERN_VERHEIRATET_ZUSAMMEN;

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
        this.goNextStep();
      },
      { allowSignalWrites: true }
    );

    effect(
      () => {
        const gerichtlicheAlimentenregelung =
          gerichtlicheAlimentenregelungSig();

        this.formUtils.setDisabledState(
          werZahltAlimente,
          gerichtlicheAlimentenregelung !== true,
          true
        );
        this.formUtils.setDisabledState(
          elternteilUnbekanntVerstorben,
          gerichtlicheAlimentenregelung !== false,
          true
        );
        this.goNextStep();
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
        this.formUtils.setDisabledState(
          sorgerecht,
          elternteilUnbekanntVerstorben !== false,
          true
        );
        this.formUtils.setDisabledState(
          obhut,
          elternteilUnbekanntVerstorben !== false,
          true
        );

        this.goNextStep();
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
        const mutterVerstorbenOderUnbekannt =
          mutterVerstorbenUnbekanntSig() ===
            ElternAbwesenheitsGrund.VERSTORBEN ||
          mutterVerstorbenUnbekanntSig() === ElternAbwesenheitsGrund.UNBEKANNT;
        const keinElternTeilUnbekanntVerstorben =
          elternteilUnbekanntVerstorbenSig() === false;

        const showVaterVerheiratedFrage =
          keinElternTeilUnbekanntVerstorben ||
          zahltMutterAlimente ||
          (mutterVerstorbenOderUnbekannt && vaterWederVerstorbenNochUnbekannt);

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
        const vaterVerstorbenOderUnbekannt =
          vaterVerstorbenUnbekanntSig() ===
            ElternAbwesenheitsGrund.VERSTORBEN ||
          vaterVerstorbenUnbekanntSig() === ElternAbwesenheitsGrund.UNBEKANNT;
        const keinElternTeilUnbekanntVerstorben =
          elternteilUnbekanntVerstorbenSig() === false;

        const showMutterVerheiratedFrage =
          keinElternTeilUnbekanntVerstorben ||
          zahltVaterAlimente ||
          (vaterVerstorbenOderUnbekannt && mutterWederVerstorbenNochUnbekannt);

        this.formUtils.setDisabledState(
          mutterWiederverheiratet,
          !showMutterVerheiratedFrage,
          true
        );
      },
      { allowSignalWrites: true }
    );
  }

  hasPreviousStep(): boolean {
    const familiensituation =
      this.buildSharedModelAdresseFromForm().familiensituation;
    if (familiensituation === undefined) {
      return false;
    }
    return (
      this.currentFamiliensituationFormStep !==
      this.currentFamiliensituationFormStep.getPrevious(familiensituation)
    );
  }

  hasNextStep(): boolean {
    const familiensituation =
      this.buildSharedModelAdresseFromForm().familiensituation;
    if (familiensituation === undefined) {
      return false;
    }
    return (
      this.currentFamiliensituationFormStep !==
      this.currentFamiliensituationFormStep.getNext(familiensituation)
    );
  }

  goPreviousStep(): void {
    const familiensituation =
      this.buildSharedModelAdresseFromForm().familiensituation;
    if (familiensituation === undefined) {
      return;
    }
    const newCurrent =
      this.currentFamiliensituationFormStep.getPrevious(familiensituation);
    const newPrev = newCurrent.getPrevious(familiensituation);
    const newNext = this.currentFamiliensituationFormStep;

    this.updateSteps(newCurrent, newNext, newPrev);
  }

  goNextStep(): void {
    const familiensituation =
      this.buildSharedModelAdresseFromForm().familiensituation;
    if (familiensituation === undefined) {
      return;
    }
    const newCurrent =
      this.currentFamiliensituationFormStep.getNext(familiensituation);
    const newPrev = this.currentFamiliensituationFormStep;
    const newNext = newCurrent.getNext(familiensituation);
    this.updateSteps(newCurrent, newNext, newPrev);
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
        ]),
        // nicht form.value, sonst werden keine Werte auf null gesetzt!
        obhutVater: percentStringToNumber(this.form.getRawValue().obhutVater),
        obhutMutter: percentStringToNumber(this.form.getRawValue().obhutMutter),
      },
    };
  }

  private updateSteps(
    newCurrent: FamiliensituationFormStep,
    newNext: FamiliensituationFormStep,
    newPrev: FamiliensituationFormStep
  ): void {
    if (this.currentFamiliensituationFormStep === newCurrent) {
      return;
    }

    this.currentFamiliensituationFormStep = newCurrent;

    this.stateSig.set({
      [this.getKeyByValue(newCurrent)]: 'in',
      ...(newCurrent !== newNext && { [this.getKeyByValue(newNext)]: 'right' }),
      ...(newCurrent !== newPrev && { [this.getKeyByValue(newPrev)]: 'left' }),
    });
  }

  private getKeyByValue(
    value: FamiliensituationFormStep
  ): keyof FamiliensituationFormSteps {
    const key = (
      Object.keys(
        FamiliensituationFormSteps
      ) as (keyof FamiliensituationFormSteps)[]
    ).find((key) => FamiliensituationFormSteps[key] === value);

    if (key === undefined) {
      throw new Error();
    }

    return key;
  }

  protected readonly GesuchFormSteps = GesuchFormSteps;
}
