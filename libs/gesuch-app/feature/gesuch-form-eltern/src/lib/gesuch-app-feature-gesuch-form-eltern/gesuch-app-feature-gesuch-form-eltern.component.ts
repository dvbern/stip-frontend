import {
  ChangeDetectionStrategy,
  Component,
  effect,
  inject,
  OnInit,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { SharedUiProgressBarComponent } from '@dv/shared/ui/progress-bar';
import {
  SharedUiFormFieldComponent,
  SharedUiFormLabelComponent,
  SharedUiFormLabelTargetDirective,
  SharedUiFormMessageComponent,
  SharedUiFormMessageErrorDirective,
} from '@dv/shared/ui/form-field';
import { TranslateModule } from '@ngx-translate/core';
import {
  GesuchAppEventGesuchFormMutter,
  GesuchAppEventGesuchFormVater,
} from '@dv/gesuch-app/event/gesuch-form-eltern';
import {
  MASK_SOZIALVERSICHERUNGSNUMMER,
  Land,
  Anrede,
} from '@dv/shared/model/gesuch';
import { Store } from '@ngrx/store';
import { MaskitoModule } from '@maskito/angular';
import {
  gesuchAppDataAccessElternsFeature,
  selectGesuchAppDataAccessElternsView,
} from '@dv/gesuch-app/data-access/eltern';
import { selectGesuchAppFeatureGesuchFormElternView } from './gesuch-app-feature-gesuch-form-eltern.selector';
import { NgbDateStruct, NgbInputDatepicker } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'dv-gesuch-app-feature-gesuch-form-eltern',
  standalone: true,
  imports: [
    CommonModule,
    SharedUiProgressBarComponent,
    SharedUiFormFieldComponent,
    SharedUiFormMessageComponent,
    SharedUiFormLabelComponent,
    ReactiveFormsModule,
    TranslateModule,
    SharedUiFormMessageErrorDirective,
    MaskitoModule,
    NgbInputDatepicker,
    SharedUiFormLabelTargetDirective,
  ],
  templateUrl: './gesuch-app-feature-gesuch-form-eltern.component.html',
  styleUrls: ['./gesuch-app-feature-gesuch-form-eltern.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class GesuchAppFeatureGesuchFormElternComponent implements OnInit {
  private store = inject(Store);

  private formBuilder = inject(FormBuilder);

  readonly MASK_SOZIALVERSICHERUNGSNUMMER = MASK_SOZIALVERSICHERUNGSNUMMER;

  readonly Land = Land;

  mutterLabel = 'gesuch-app.form.eltern.mutter.title';
  vaterLabel = 'gesuch-app.form.eltern.vater.title';
  displayLabel = '';
  geburtsdatumMinDate: NgbDateStruct = { year: 1900, month: 1, day: 1 };
  geburtsdatumMaxDate: NgbDateStruct = {
    year: new Date().getFullYear(),
    month: new Date().getMonth() + 1,
    day: new Date().getDate(),
  };

  form = this.formBuilder.group({
    name: ['', [Validators.required]],
    vorname: ['', [Validators.required]],
    addresse: this.formBuilder.group({
      strasse: ['', [Validators.required]],
      nummer: ['', []],
      plz: ['', [Validators.required]],
      ort: ['', [Validators.required]],
      land: ['', [Validators.required]],
    }),
    identischerZivilrechtlicherWohnsitz: [false, []],
    telefonnummer: ['', [Validators.required]],
    sozialversicherungsnummer: ['', [Validators.required]],
    geburtsdatum: ['', [Validators.required]],
    sozialhilfebeitraegeAusbezahlt: [false, [Validators.required]],
    ausweisbFluechtling: [false, [Validators.required]],
    ergaenzungsleistungAusbezahlt: [false, [Validators.required]],
  });

  view = this.store.selectSignal(selectGesuchAppFeatureGesuchFormElternView);

  elternView = this.store.selectSignal(selectGesuchAppDataAccessElternsView);

  constructor() {
    effect(() => {
      const { elternContainer } = this.elternView();
      console.log(elternContainer);
      console.log(elternContainer?.elternSB);
      if (elternContainer?.elternSB) {
        const eltern = elternContainer.elternSB;
        const elternForForm = {
          ...eltern,
          geburtsdatum: eltern.geburtsdatum.toString(),
        };
        this.form.patchValue({ ...elternForForm });
      }
    });
  }

  ngOnInit(): void {
    if (this.view().type === Anrede.HERR) {
      this.displayLabel = this.vaterLabel;
      this.store.dispatch(GesuchAppEventGesuchFormVater.init());
    } else {
      this.displayLabel = this.mutterLabel;
      this.store.dispatch(GesuchAppEventGesuchFormMutter.init());
    }
  }

  handleSaveAndContinue() {
    this.form.markAllAsTouched();
    if (this.form.valid) {
      //TODO navigate next and save
    }
  }

  handleSaveAndBack() {
    this.form.markAllAsTouched();
    if (this.form.valid) {
      //TODO Navigate back and save
    }
  }

  trackByIndex(index: number) {
    return index;
  }
}
