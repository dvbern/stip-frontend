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
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { selectGesuchAppDataAccessGesuchsView } from '@dv/gesuch-app/data-access/gesuch';
import { GesuchAppEventGesuchFormAuszahlung } from '@dv/gesuch-app/event/gesuch-form-auszahlung';
import { GesuchFormSteps } from '@dv/gesuch-app/model/gesuch-form';
import {
  ElternDTO,
  KontoinhaberinType,
  Land,
  PersonInAusbildungDTO,
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

@Component({
  selector: 'dv-gesuch-app-feature-gesuch-form-auszahlungen',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    SharedUiFormFieldComponent,
    SharedUiFormLabelComponent,
    SharedUiFormLabelTargetDirective,
    SharedUiFormMessageComponent,
    SharedUiFormMessageErrorDirective,
    SharedUiProgressBarComponent,
    TranslateModule,
  ],
  templateUrl: './gesuch-app-feature-gesuch-form-auszahlungen.component.html',
  styleUrls: ['./gesuch-app-feature-gesuch-form-auszahlungen.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class GesuchAppFeatureGesuchFormAuszahlungenComponent implements OnInit {
  private store = inject(Store);
  private fb = inject(FormBuilder);

  KontoinhaberinType = KontoinhaberinType;

  form = this.fb.group({
    kontoinhaberin: [<KontoinhaberinType | null>null, [Validators.required]],
    name: [''],
    vorname: [''],
    addresse: this.fb.group({
      strasse: ['', [Validators.required]],
      nummer: ['', []],
      plz: ['', [Validators.required]],
      ort: ['', [Validators.required]],
      land: [<null | Land>null, [Validators.required]],
    }),
    iban: ['', [Validators.required]],
  });

  view = this.store.selectSignal(selectGesuchAppDataAccessGesuchsView);

  constructor() {
    const kontoinhaberin$ = toSignal(
      this.form.controls.kontoinhaberin.valueChanges
    );

    effect(
      () => {
        const { gesuch } = this.view();
        if (gesuch !== undefined) {
          const initalValue = gesuch.auszahlungContainer?.auszahlungSB || {};
          this.form.patchValue({ ...initalValue });
        }
      },
      { allowSignalWrites: true }
    );

    effect(
      () => {
        const kontoinhaberin = kontoinhaberin$();
        const { gesuch } = this.view();

        switch (kontoinhaberin) {
          case KontoinhaberinType.GESUCHSTELLERIN:
            this.setGesuchstellerinValues(
              gesuch?.personInAusbildungContainer?.personInAusbildungSB
            );
            this.disableNameAndAdresse();
            break;
          case KontoinhaberinType.VATER:
            // replace with actual once implemented
            this.setElternValues({} as ElternDTO);
            this.disableNameAndAdresse();
            break;
          case KontoinhaberinType.MUTTER:
            // replace with actual once implemented
            this.setElternValues({} as ElternDTO);
            this.disableNameAndAdresse();
            break;
          case KontoinhaberinType.ANDERE:
          case KontoinhaberinType.SOZIALDIENST_INSTITUTION:
          default:
            this.enableNameAndAdresse();
            break;
        }
      },
      { allowSignalWrites: true }
    );
  }

  ngOnInit(): void {
    this.store.dispatch(GesuchAppEventGesuchFormAuszahlung.init());
  }

  private setGesuchstellerinValues(
    personInAusbildung: PersonInAusbildungDTO | undefined
  ): void {
    this.form.controls.name.patchValue(personInAusbildung?.name || '');
    this.form.controls.vorname.patchValue(personInAusbildung?.vorname || '');
    this.form.controls.addresse.patchValue(personInAusbildung?.adresse || {});
  }

  private disableNameAndAdresse(): void {
    this.form.controls.name.disable();
    this.form.controls.vorname.disable();
    this.form.controls.addresse.disable();
  }

  private enableNameAndAdresse(): void {
    this.form.controls.name.enable();
    this.form.controls.vorname.enable();
    this.form.controls.addresse.enable();
  }

  private setElternValues(elternValues: ElternDTO): void {
    this.form.controls.name.patchValue(elternValues?.name);
    this.form.controls.vorname.patchValue(elternValues?.vorname);
    this.form.controls.addresse.patchValue(elternValues?.adresse);
  }

  handleSave(): void {
    this.form.markAllAsTouched();
    if (this.form.valid) {
      this.store.dispatch(
        GesuchAppEventGesuchFormAuszahlung.saveTriggered({
          gesuch: this.buildBackGesuch(),
          origin: GesuchFormSteps.AUSZAHLUNGEN,
        })
      );
    }
  }

  trackByIndex(index: number) {
    return index;
  }

  protected readonly Land = Land;

  private buildBackGesuch(): Partial<SharedModelGesuch> {
    const gesuch = this.view().gesuch;
    return {
      ...gesuch,
      auszahlungContainer: {
        ...gesuch?.auszahlungContainer,
        auszahlungSB: {
          ...gesuch?.auszahlungContainer?.auszahlungSB,
          ...(this.form.value as any),
        },
      },
    };
  }
}
