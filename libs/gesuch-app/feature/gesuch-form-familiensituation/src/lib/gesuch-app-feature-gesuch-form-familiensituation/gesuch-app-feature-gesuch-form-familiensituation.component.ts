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
  FormBuilder,
  FormControl,
  FormGroup,
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

  form: FormGroup<GesuchFamiliensituationForm> =
    this.formBuilder.group<GesuchFamiliensituationForm>({
      leiblicheElternVerheiratetKonkubinat: new FormControl(
        { value: null, disabled: false },
        { validators: Validators.required }
      ),
      gerichtlicheAlimentenregelung: new FormControl(
        { value: null, disabled: false },
        { validators: Validators.required }
      ),
      werZahltAlimente: new FormControl(
        { value: null, disabled: false },
        { validators: Validators.required }
      ),
      elternteilVerstorbenUnbekannt: new FormControl(
        { value: null, disabled: false },
        { validators: Validators.required }
      ),
      mutterUnbekanntVerstorben: new FormControl(
        { value: null, disabled: false },
        { validators: Validators.required }
      ),
      vaterUnbekanntVerstorben: new FormControl(
        { value: null, disabled: false },
        { validators: Validators.required }
      ),
      mutterUnbekanntReason: new FormControl(
        { value: null, disabled: false },
        { validators: Validators.required }
      ),
      vaterUnbekanntReason: new FormControl(
        { value: null, disabled: false },
        { validators: Validators.required }
      ),
      vaterWiederverheiratet: new FormControl(
        { value: null, disabled: false },
        { validators: Validators.required }
      ),
      mutterWiederverheiratet: new FormControl(
        { value: null, disabled: false },
        { validators: Validators.required }
      ),
      sorgerecht: new FormControl(
        { value: null, disabled: false },
        { validators: Validators.required }
      ),
      obhut: new FormControl(
        { value: null, disabled: false },
        { validators: Validators.required }
      ),
      obhutMutter: new FormControl(
        { value: null, disabled: false },
        { validators: Validators.required }
      ),
      obhutVater: new FormControl(
        { value: null, disabled: false },
        { validators: Validators.required }
      ),
    });

  view = this.store.selectSignal(selectGesuchAppDataAccessGesuchsView);
  formValue$ = toSignal(this.form.valueChanges);

  ngOnInit(): void {
    this.metadataService.registerForm(this.form);
  }

  constructor() {
    this.store.dispatch(GesuchAppEventGesuchFormFamiliensituation.init());
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
    effect(() => {
      const formValue = this.formValue$() as FamiliensituationDTO;
      if (formValue !== undefined) {
        this.metadataService.update(formValue);
      }
    });
  }

  isVisible(formControlName: keyof GesuchFamiliensituationForm): boolean {
    return this.metadataService.isVisible(formControlName);
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
    this.metadataService.markVisibleFormControlsAsTouched();
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
