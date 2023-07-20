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
import { TranslateModule, TranslateService } from '@ngx-translate/core';

import {
  SharedUiFormComponent,
  SharedUiFormLabelComponent,
  SharedUiFormLabelTargetDirective,
  SharedUiFormMessageComponent,
  SharedUiFormMessageErrorDirective,
  SharedUiFormMessageInfoDirective,
} from '@dv/shared/ui/form';
import { Land } from '@dv/shared/model/gesuch';
import { BehaviorSubject, combineLatest } from 'rxjs';
import { map, startWith } from 'rxjs/operators';

@Component({
  selector: 'dv-shared-ui-form-address',
  standalone: true,
  imports: [
    CommonModule,
    TranslateModule,
    FormsModule,
    ReactiveFormsModule,
    SharedUiFormComponent,
    SharedUiFormLabelComponent,
    SharedUiFormLabelTargetDirective,
    SharedUiFormMessageComponent,
    SharedUiFormMessageErrorDirective,
    SharedUiFormMessageInfoDirective,
  ],
  templateUrl: './shared-ui-form-address.component.html',
  styleUrls: ['./shared-ui-form-address.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SharedUiFormAddressComponent implements DoCheck, OnChanges {
  @Input({ required: true }) group!: FormGroup;

  @Input({ required: true }) laender!: Land[];

  @Input({ required: true }) language!: string;

  touchedSig = signal(false);
  private translate = inject(TranslateService);
  private laender$ = new BehaviorSubject<string[]>([]);

  constructor() {
    window.addEventListener('keyup', (ev) => {
      const code = ev.code;
      console.log('CODE?', ev);
      if (code === 'KeyF') {
        this.translate.use('fr');
      } else if (code === 'KeyD') {
        this.translate.use('de');
      }
    });
  }

  translatedLaender$ = combineLatest([
    this.translate.onLangChange.pipe(
      startWith({
        translations: this.translate.translations[this.translate.currentLang],
      })
    ),
    this.laender$,
  ]).pipe(
    map(([{ translations }, laender]) => {
      console.log('translations', translations);
      const translated = laender
        .filter((code) => code !== 'CH')
        .map((code) => ({
          code,
          text:
            translations[`gesuch-app.shared.country.${code}`] ?? `zzz_${code}`,
        }));
      translated.sort(({ text: a }, { text: b }) =>
        a.localeCompare(b, this.translate.currentLang, {
          ignorePunctuation: true,
        })
      );
      return [
        { code: 'CH', text: translations['gesuch-app.shared.country.CH'] },
        ...translated,
      ];
    })
  );

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

  ngOnChanges(change: SimpleChanges) {
    console.log('CHANGE', change);
    if (change['laender'].currentValue) {
      this.laender$.next(change['laender'].currentValue);
    }
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
}
