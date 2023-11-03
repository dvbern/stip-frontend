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
  FormControl,
  NonNullableFormBuilder,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatRadioModule } from '@angular/material/radio';
import { MatSelectModule } from '@angular/material/select';
import { SharedUiStepperNavigationComponent } from '@dv/shared/ui/stepper-navigation';
import { MaskitoModule } from '@maskito/angular';
import { Store } from '@ngrx/store';
import { TranslateModule } from '@ngx-translate/core';
import { BehaviorSubject, Subject } from 'rxjs';

import { selectSharedDataAccessGesuchsView } from '@dv/shared/data-access/gesuch';
import { SharedEventGesuchFormFamiliensituation } from '@dv/shared/event/gesuch-form-familiensituation';
import { FAMILIENSITUATION } from '@dv/shared/model/gesuch-form';
import {
  numberToPercentString,
  percentStringToNumber,
  SharedUiPercentageSplitterComponent,
} from '@dv/shared/ui/percentage-splitter';
import { GesuchAppUiStepFormButtonsComponent } from '@dv/shared/ui/step-form-buttons';
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
  selector: 'dv-shared-feature-gesuch-form-familiensituation',
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
    SharedUiPercentageSplitterComponent,
    GesuchAppUiStepFormButtonsComponent,
    SharedUiStepperNavigationComponent,
  ],
  templateUrl: './shared-feature-gesuch-form-familiensituation.component.html',
  styleUrls: ['./shared-feature-gesuch-form-familiensituation.component.scss'],
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
    trigger('hideDuringAnimation', [
      state('hide', style({ opacity: 0 })),
      state('show', style({ opacity: 1 })),
      transition('* => *', [animate(`150ms ease-in`)]),
      transition('void => *', []),
    ]),
  ],
})
export class SharedFeatureGesuchFormFamiliensituationComponent
  implements OnInit
{
  private elementRef = inject(ElementRef);
  private store = inject(Store);
  private formBuilder = inject(NonNullableFormBuilder);
  private formUtils = inject(SharedUtilFormService);

  readonly ELTERNSCHAFTSTEILUNG = Elternschaftsteilung;
  readonly ELTERN_ABWESENHEITS_GRUND = ElternAbwesenheitsGrund;
  readonly ELTERN_UNBEKANNTHEITS_GRUND = ElternUnbekanntheitsGrund;

  hiddenFieldsSetSig = signal(new Set());

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

  duringAnimation: 'show' | 'hide' = 'show';
  view = this.store.selectSignal(selectSharedDataAccessGesuchsView);
  updateValidity$ = new Subject<unknown>();

  stateSig: WritableSignal<FamSitStepMeta> = signal({
    ELTERN_VERHEIRATET_ZUSAMMEN: 'in',
    ALIMENTENREGELUNG: 'right',
  });

  private currentFamiliensituationFormStep =
    FamiliensituationFormSteps.ELTERN_VERHEIRATET_ZUSAMMEN;

  ngOnInit(): void {
    this.store.dispatch(SharedEventGesuchFormFamiliensituation.init());
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
        } else {
          this.form.reset();
        }
      },
      { allowSignalWrites: true }
    );

    // effect for gerichtlicheAlimentenregelung
    effect(
      () => {
        this.setDisabledStateAndHide(
          gerichtlicheAlimentenregelung,
          elternVerheiratetZusammenSig() !== false
        );
        this.goNextStep();
      },
      { allowSignalWrites: true }
    );

    effect(
      () => {
        const gerichtlicheAlimentenregelung =
          gerichtlicheAlimentenregelungSig();

        this.setDisabledStateAndHide(
          werZahltAlimente,
          gerichtlicheAlimentenregelung !== true
        );
        this.setDisabledStateAndHide(
          elternteilUnbekanntVerstorben,
          gerichtlicheAlimentenregelung !== false
        );
        this.goNextStep();
      },
      { allowSignalWrites: true }
    );

    effect(
      () => {
        const elternteilUnbekanntVerstorben =
          elternteilUnbekanntVerstorbenSig();
        this.setDisabledStateAndHide(
          mutterUnbekanntVerstorben,
          elternteilUnbekanntVerstorben !== true
        );
        this.setDisabledStateAndHide(
          vaterUnbekanntVerstorben,
          elternteilUnbekanntVerstorben !== true
        );
        this.setDisabledStateAndHide(
          sorgerecht,
          elternteilUnbekanntVerstorben !== false
        );
        this.setDisabledStateAndHide(
          obhut,
          elternteilUnbekanntVerstorben !== false
        );
        this.goNextStep();
      },
      { allowSignalWrites: true }
    );

    effect(
      () => {
        const vaterUnbekanntVerstorben = vaterVerstorbenUnbekanntSig();
        this.setDisabledStateAndHide(
          vaterUnbekanntGrund,
          vaterUnbekanntVerstorben !== ElternAbwesenheitsGrund.UNBEKANNT
        );
      },
      { allowSignalWrites: true }
    );

    effect(
      () => {
        const mutterUnbekanntVerstorben = mutterVerstorbenUnbekanntSig();
        this.setDisabledStateAndHide(
          mutterUnbekanntGrund,
          mutterUnbekanntVerstorben !== ElternAbwesenheitsGrund.UNBEKANNT
        );
      },
      { allowSignalWrites: true }
    );

    effect(
      () => {
        const notGemeinsam = obhutSig() !== Elternschaftsteilung.GEMEINSAM;
        this.setDisabledStateAndHide(obhutVater, notGemeinsam);
        this.setDisabledStateAndHide(obhutMutter, notGemeinsam);
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

        this.setDisabledStateAndHide(
          vaterWiederverheiratet,
          !showVaterVerheiratedFrage
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

        this.setDisabledStateAndHide(
          mutterWiederverheiratet,
          !showMutterVerheiratedFrage
        );
      },
      { allowSignalWrites: true }
    );

    effect(
      () => {
        const { readonly } = this.view();
        if (readonly) {
          Object.values(this.form.controls).forEach((control) =>
            control.disable()
          );
        }
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
        SharedEventGesuchFormFamiliensituation.saveTriggered({
          gesuchId: gesuch.id,
          trancheId: gesuch.gesuchTrancheToWorkWith.id,
          gesuchFormular,
          origin: FAMILIENSITUATION,
        })
      );
    }
  }

  handleContinue() {
    const { gesuch } = this.view();
    if (gesuch?.id) {
      this.store.dispatch(
        SharedEventGesuchFormFamiliensituation.nextTriggered({
          id: gesuch.id,
          trancheId: gesuch.gesuchTrancheToWorkWith.id,
          origin: FAMILIENSITUATION,
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

  private setDisabledStateAndHide(
    formControl: FormControl,
    disabled: boolean
  ): void {
    this.formUtils.setDisabledState(formControl, disabled, true);
    this.hiddenFieldsSetSig.update((setToUpdate) => {
      if (disabled) {
        setToUpdate.add(formControl);
      } else {
        setToUpdate.delete(formControl);
      }
      return setToUpdate;
    });
  }
}
