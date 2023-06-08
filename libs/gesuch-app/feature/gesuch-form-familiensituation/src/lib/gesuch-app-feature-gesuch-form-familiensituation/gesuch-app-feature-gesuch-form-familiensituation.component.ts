import {
  ChangeDetectionStrategy,
  Component,
  effect,
  inject,
  OnInit,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { toSignal } from '@angular/core/rxjs-interop';
import {
  AbstractControl,
  FormBuilder,
  FormControl,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
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
import { MaskitoModule } from '@maskito/angular';
import { Store } from '@ngrx/store';
import { TranslateModule } from '@ngx-translate/core';
import { GesuchFormFamiliensituationMetadataService } from './gesuch-app-feature-gesuch-form-familiensituation.service.ts/gesuch-form-familiensituation-metadata.service';
import { GesuchFamiliensituationForm } from './gesuch-familiensituation-form';

@Component({
  selector: 'dv-gesuch-app-feature-gesuch-form-familiensituation',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    SharedUiProgressBarComponent,
    TranslateModule,
    SharedUiFormFieldComponent,
    SharedUiFormLabelComponent,
    SharedUiFormLabelTargetDirective,
    SharedUiFormMessageComponent,
    SharedUiFormMessageErrorDirective,
    MaskitoModule,
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
  private metadataService = inject(GesuchFormFamiliensituationMetadataService);

  readonly ELTERNSCHAFTSTEILUNG = Elternschaftsteilung;
  readonly ELTERN_ABWESENHEITS_GRUND = ElternAbwesenheitsGrund;
  readonly ELTERN_UNBEKANNTHEITS_GRUND = ElternUnbekanntheitsGrund;

  form = this.formBuilder.group<GesuchFamiliensituationForm>({
    leiblicheElternVerheiratetKonkubinat: new FormControl(null, {
      validators: Validators.required,
    }),
    gerichtlicheAlimentenregelung: new FormControl(null, {
      validators: Validators.required,
    }),
    werZahltAlimente: new FormControl(null, {
      validators: Validators.required,
    }),
    elternteilVerstorbenUnbekannt: new FormControl(null, {
      validators: Validators.required,
    }),
    mutterUnbekanntVerstorben: new FormControl(null, {
      validators: Validators.required,
    }),
    vaterUnbekanntVerstorben: new FormControl(null, {
      validators: Validators.required,
    }),
    mutterUnbekanntReason: new FormControl(null, {
      validators: Validators.required,
    }),
    vaterUnbekanntReason: new FormControl(null, {
      validators: Validators.required,
    }),
    vaterWiederverheiratet: new FormControl(null, {
      validators: Validators.required,
    }),
    mutterWiederverheiratet: new FormControl(null, {
      validators: Validators.required,
    }),
    sorgerecht: new FormControl(null, { validators: Validators.required }),
    obhut: new FormControl(null, { validators: Validators.required }),
    obhutMutter: new FormControl(null, { validators: Validators.required }),
    obhutVater: new FormControl(null, { validators: Validators.required }),
    sorgerechtMutter: new FormControl(null, {
      validators: Validators.required,
    }),
    sorgerechtVater: new FormControl(null, { validators: Validators.required }),
  });

  view = this.store.selectSignal(selectGesuchAppDataAccessGesuchsView);

  ngOnInit(): void {
    this.store.dispatch(GesuchAppEventGesuchFormFamiliensituation.init());
    this.metadataService.registerForm(this.form);
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
    const mutterUnbekanntReason$ = toSignal(
      this.form.controls.mutterUnbekanntReason.valueChanges
    );
    const vaterUnbekanntReason$ = toSignal(
      this.form.controls.vaterUnbekanntReason.valueChanges
    );
    const obhut$ = toSignal(this.form.controls.obhut.valueChanges);
    const sorgerecht$ = toSignal(this.form.controls.sorgerecht.valueChanges);

    effect(
      () => {
        const { gesuch } = this.view();
        if (gesuch !== undefined) {
          const initialFormFamSit =
            gesuch?.familiensituationContainer?.familiensituationSB || {};
          this.form.patchValue({ ...initialFormFamSit }, { emitEvent: true });
        }
      },
      { allowSignalWrites: true }
    );

    effect(
      () => {
        if (leiblicheElternVerheiratetKonkubinat$() === true) {
          this.metadataService.setInvisible(
            this.form.controls.gerichtlicheAlimentenregelung
          );
        } else {
          this.metadataService.setVisible(
            this.form.controls.gerichtlicheAlimentenregelung
          );
        }
      },
      { allowSignalWrites: true }
    );

    effect(
      () => {
        if (gerichtlicheAlimentenregelung$() === true) {
          this.metadataService.setVisible(this.form.controls.werZahltAlimente);
          this.metadataService.setInvisible(
            this.form.controls.elternteilVerstorbenUnbekannt
          );
        } else if (gerichtlicheAlimentenregelung$() === false) {
          this.metadataService.setVisible(
            this.form.controls.elternteilVerstorbenUnbekannt
          );
          this.metadataService.setInvisible(
            this.form.controls.werZahltAlimente
          );
        } else {
          this.metadataService.setInvisible(
            this.form.controls.werZahltAlimente
          );
          this.metadataService.setInvisible(
            this.form.controls.elternteilVerstorbenUnbekannt
          );
        }
      },
      { allowSignalWrites: true }
    );

    effect(
      () => {
        if (werZahltAlimente$() === Elternschaftsteilung.MUTTER) {
          this.metadataService.setVisible(
            this.form.controls.vaterWiederverheiratet
          );
          this.metadataService.setInvisible(
            this.form.controls.mutterWiederverheiratet
          );
        } else if (werZahltAlimente$() === Elternschaftsteilung.VATER) {
          this.metadataService.setVisible(
            this.form.controls.mutterWiederverheiratet
          );
          this.metadataService.setInvisible(
            this.form.controls.vaterWiederverheiratet
          );
        } else {
          this.metadataService.setInvisible(
            this.form.controls.mutterWiederverheiratet
          );
          this.metadataService.setInvisible(
            this.form.controls.vaterWiederverheiratet
          );
        }
      },
      { allowSignalWrites: true }
    );

    effect(
      () => {
        if (elternteilVerstorbenUnbekannt$() === true) {
          this.metadataService.setVisible(
            this.form.controls.vaterUnbekanntVerstorben
          );
          this.metadataService.setVisible(
            this.form.controls.mutterUnbekanntVerstorben
          );
        } else if (elternteilVerstorbenUnbekannt$() === false) {
          this.metadataService.setVisible(
            this.form.controls.vaterWiederverheiratet
          );
          this.metadataService.setVisible(
            this.form.controls.mutterWiederverheiratet
          );
          this.metadataService.setVisible(this.form.controls.sorgerecht);
          this.metadataService.setVisible(this.form.controls.sorgerechtVater);
          this.metadataService.setVisible(this.form.controls.sorgerechtMutter);
          this.metadataService.setVisible(this.form.controls.obhut);
          this.metadataService.setInvisible(
            this.form.controls.vaterUnbekanntVerstorben
          );
          this.metadataService.setInvisible(
            this.form.controls.mutterUnbekanntVerstorben
          );
        } else {
          this.metadataService.setInvisible(
            this.form.controls.vaterWiederverheiratet
          );
          this.metadataService.setInvisible(
            this.form.controls.mutterWiederverheiratet
          );
          this.metadataService.setInvisible(this.form.controls.sorgerecht);
          this.metadataService.setInvisible(
            this.form.controls.sorgerechtMutter
          );
          this.metadataService.setInvisible(this.form.controls.sorgerechtVater);
          this.metadataService.setInvisible(this.form.controls.obhut);
          this.metadataService.setInvisible(
            this.form.controls.vaterUnbekanntVerstorben
          );
          this.metadataService.setInvisible(
            this.form.controls.mutterUnbekanntVerstorben
          );
        }
      },
      { allowSignalWrites: true }
    );

    effect(
      () => {
        if (
          vaterVerstorbenUnbekannt$() === ElternAbwesenheitsGrund.WEDER_NOCH
        ) {
          this.metadataService.setVisible(
            this.form.controls.vaterWiederverheiratet
          );
          this.metadataService.setInvisible(
            this.form.controls.vaterUnbekanntReason
          );
        } else if (
          vaterVerstorbenUnbekannt$() === ElternAbwesenheitsGrund.UNBEKANNT
        ) {
          this.metadataService.setVisible(
            this.form.controls.vaterUnbekanntReason
          );
          this.metadataService.setInvisible(
            this.form.controls.vaterWiederverheiratet
          );
        } else {
          this.metadataService.setInvisible(
            this.form.controls.vaterWiederverheiratet
          );
          this.metadataService.setInvisible(
            this.form.controls.vaterUnbekanntReason
          );
        }
      },
      { allowSignalWrites: true }
    );

    effect(
      () => {
        if (
          mutterVerstorbenUnbekannt$() === ElternAbwesenheitsGrund.WEDER_NOCH
        ) {
          this.metadataService.setVisible(
            this.form.controls.mutterWiederverheiratet
          );
          this.metadataService.setInvisible(
            this.form.controls.mutterUnbekanntReason
          );
        } else if (
          mutterVerstorbenUnbekannt$() === ElternAbwesenheitsGrund.UNBEKANNT
        ) {
          this.metadataService.setVisible(
            this.form.controls.mutterUnbekanntReason
          );
          this.metadataService.setInvisible(
            this.form.controls.mutterWiederverheiratet
          );
        } else {
          this.metadataService.setInvisible(
            this.form.controls.mutterUnbekanntReason
          );
          this.metadataService.setInvisible(
            this.form.controls.mutterWiederverheiratet
          );
        }
      },
      { allowSignalWrites: true }
    );

    effect(() => {
      const mutterUnbekanntReason = mutterUnbekanntReason$();
      const vaterVerstorbenUnbekannt = vaterVerstorbenUnbekannt$();
      if (
        vaterVerstorbenUnbekannt === ElternAbwesenheitsGrund.WEDER_NOCH &&
        mutterUnbekanntReason !== null &&
        mutterUnbekanntReason !== undefined
      ) {
        this.metadataService.setVisible(
          this.form.controls.vaterWiederverheiratet
        );
      } else {
        this.metadataService.setInvisible(
          this.form.controls.vaterWiederverheiratet
        );
      }
    });

    effect(() => {
      const vaterUnbekanntReason = vaterUnbekanntReason$();
      const mutterVerstorbenUnbekannt = mutterVerstorbenUnbekannt$();
      if (
        mutterVerstorbenUnbekannt === ElternAbwesenheitsGrund.WEDER_NOCH &&
        vaterUnbekanntReason !== null &&
        vaterUnbekanntReason !== undefined
      ) {
        this.metadataService.setVisible(
          this.form.controls.mutterWiederverheiratet
        );
      } else {
        this.metadataService.setInvisible(
          this.form.controls.mutterWiederverheiratet
        );
      }
    });

    effect(() => {
      if (obhut$() === Elternschaftsteilung.GEMEINSAM) {
        this.metadataService.setVisible(this.form.controls.obhutVater);
        this.metadataService.setVisible(this.form.controls.obhutMutter);
      } else {
        this.metadataService.setInvisible(this.form.controls.obhutVater);
        this.metadataService.setInvisible(this.form.controls.obhutMutter);
      }
    });

    effect(() => {
      if (sorgerecht$() === Elternschaftsteilung.GEMEINSAM) {
        this.metadataService.setVisible(this.form.controls.sorgerechtVater);
        this.metadataService.setVisible(this.form.controls.sorgerechtMutter);
      } else {
        this.metadataService.setInvisible(this.form.controls.sorgerechtVater);
        this.metadataService.setInvisible(this.form.controls.sorgerechtMutter);
      }
    });
  }

  isVisible(control: AbstractControl | null): boolean {
    if (control === null) {
      return false;
    }
    return this.metadataService.isVisible(control);
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
}
