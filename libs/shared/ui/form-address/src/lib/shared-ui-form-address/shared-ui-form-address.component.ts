import {
  FormGroup,
  FormsModule,
  NonNullableFormBuilder,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import {
  ChangeDetectionStrategy,
  Component,
  DoCheck,
  Input,
  OnChanges,
  SimpleChanges,
  inject,
  signal,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { BehaviorSubject } from 'rxjs';
import { switchMap } from 'rxjs/operators';

import {
  SharedUiFormFieldDirective,
  SharedUiFormMessageErrorDirective,
} from '@dv/shared/ui/form';
import { SharedUiFormCountryComponent } from '@dv/shared/ui/form-country';
import { Land } from '@dv/shared/model/gesuch';
import { SharedUtilCountriesService } from '@dv/shared/util/countries';

@Component({
  selector: 'dv-shared-ui-form-address',
  standalone: true,
  imports: [
    CommonModule,
    TranslateModule,
    FormsModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    SharedUiFormFieldDirective,
    SharedUiFormCountryComponent,
    SharedUiFormMessageErrorDirective,
  ],
  templateUrl: './shared-ui-form-address.component.html',
  styleUrls: ['./shared-ui-form-address.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SharedUiFormAddressComponent implements DoCheck, OnChanges {
  @Input({ required: true }) group!: FormGroup;
  @Input({ required: true }) laender!: Land[];
  @Input({ required: true }) language!: string;

  private countriesService = inject(SharedUtilCountriesService);
  private laender$ = new BehaviorSubject<Land[]>([]);

  translatedLaender$ = this.laender$.pipe(
    switchMap((laender) => this.countriesService.getCountryList(laender))
  );

  touchedSig = signal(false);

  static buildAddressFormGroup(fb: NonNullableFormBuilder) {
    return fb.group({
      coAdresse: ['', []],
      strasse: ['', [Validators.required]],
      hausnummer: ['', []],
      plz: ['', [Validators.required]],
      ort: ['', [Validators.required]],
      land: fb.control<Land>('' as Land, {
        validators: Validators.required,
      }),
    });
  }

  trackByIndex(index: number) {
    return index;
  }

  ngDoCheck(): void {
    if (!this.group) {
      return;
    }

    if (this.group.untouched) {
      this.touchedSig.set(false);
    }

    if (this.group.touched) {
      this.touchedSig.set(true);
    }
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['laender']?.currentValue) {
      this.laender$.next(changes['laender'].currentValue);
    }
  }
}
