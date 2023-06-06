import {
  ChangeDetectionStrategy,
  Component,
  effect,
  inject,
  OnInit,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import {FormBuilder, FormControl, FormGroup, ReactiveFormsModule, Validators} from '@angular/forms';
import { selectGesuchAppDataAccessGesuchsView } from '@dv/gesuch-app/data-access/gesuch';
import { GesuchAppEventGesuchFormFamiliensituation } from '@dv/gesuch-app/event/gesuch-form-familiensituation';
import {ElternAbwesenheitsGrund, Elternschaftsteilung, ElternUnbekanntheitsGrund} from '@dv/shared/model/gesuch';
import {
  SharedUiFormFieldComponent,
  SharedUiFormLabelComponent,
  SharedUiFormLabelTargetDirective, SharedUiFormMessageComponent, SharedUiFormMessageErrorDirective,
} from '@dv/shared/ui/form-field';
import {SharedUiProgressBarComponent} from '@dv/shared/ui/progress-bar';
import { Store } from '@ngrx/store';
import {TranslateModule} from '@ngx-translate/core';
import {
  GesuchFormFamiliensituationMetadataService
} from './gesuch-app-feature-gesuch-form-familiensituation.service.ts/gesuch-form-familiensituation-metadata.service';
import {GesuchFamiliensituationForm} from './gesuch-familiensituation-form';

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

  form: FormGroup<GesuchFamiliensituationForm> = this.formBuilder.group<GesuchFamiliensituationForm>({
    leiblicheElternVerheiratetKonkubinat: new FormControl(null, {validators: Validators.required}),
    gerichtlicheAlimentenregelung: new FormControl(null, {validators: Validators.required}),
    werZahltAlimente: new FormControl(null, {validators: Validators.required}),
    elternteilVerstorbenUnbekannt: new FormControl(null, {validators: Validators.required}),
    elternteilVerstorben: new FormControl(null, {validators: Validators.required}),
    mutterUnbekanntVerstorben: new FormControl(null, {validators: Validators.required}),
    vaterUnbekanntVerstorben: new FormControl(null, {validators: Validators.required}),
    mutterUnbekanntReason: new FormControl(null, {validators: Validators.required}),
    vaterUnbekanntReason: new FormControl(null, {validators: Validators.required}),
    vaterWiederverheiratet: new FormControl(null, {validators: Validators.required}),
    mutterWiederverheiratet: new FormControl(null, {validators: Validators.required}),
    sorgerecht: new FormControl(null, {validators: Validators.required}),
    obhut: new FormControl(null, {validators: Validators.required}),
    obhutMutter: new FormControl(null, {validators: Validators.required}),
    obhutVater: new FormControl(null, {validators: Validators.required, nonNullable: false}),
  });

  view = this.store.selectSignal(selectGesuchAppDataAccessGesuchsView);

  ngOnInit(): void {
    this.store.dispatch(GesuchAppEventGesuchFormFamiliensituation.init());
    this.metadataService.registerForm(this.form);
    this.form.valueChanges.subscribe(() => this.metadataService.update(this.form));
  }

  constructor() {
    effect(() => {
      const { gesuch } = this.view();
      const familiensitutationForForm = {};
      this.form.patchValue({ ...familiensitutationForForm });
    });
    // effect(() => {
    //   toSignal(this.form.valueChanges)();
    //   this.metadataService.update(this.form);
    // });
  }

  isVisible(formControlName: keyof GesuchFamiliensituationForm): boolean {
    return this.metadataService.isVisible(formControlName);
  }

  handleSaveAndContinue(): void {
  }
}
