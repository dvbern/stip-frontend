import {
  ChangeDetectionStrategy,
  Component,
  Input,
  OnChanges,
  SimpleChanges,
  inject,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { TranslateModule, TranslateService } from '@ngx-translate/core';

import { Land } from '@dv/shared/model/gesuch';
import {
  SharedUiFormFieldDirective,
  SharedUiFormMessageErrorDirective,
} from '@dv/shared/ui/form';
import {
  SharedUiFormControlProxyDirective,
  ProxyableControl,
  injectTargetControl,
} from '@dv/shared/ui/form-control-proxy';
import { combineLatest, startWith, map, BehaviorSubject } from 'rxjs';

@Component({
  selector: 'dv-shared-ui-form-country',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    TranslateModule,
    MatFormFieldModule,
    MatSelectModule,
    SharedUiFormFieldDirective,
    SharedUiFormMessageErrorDirective,
  ],
  hostDirectives: [SharedUiFormControlProxyDirective],
  templateUrl: './shared-ui-form-country.component.html',
  styleUrls: ['./shared-ui-form-country.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SharedUiFormCountryComponent
  implements ProxyableControl, OnChanges
{
  @Input({ required: true }) labelText!: string;
  @Input({ required: true }) laender!: Land[];
  ngControl = injectTargetControl();

  private translate = inject(TranslateService);
  private laender$ = new BehaviorSubject<string[]>([]);

  translatedLaender$ = combineLatest([
    this.translate.onLangChange.pipe(
      startWith({
        translations: this.translate.translations[this.translate.currentLang],
      })
    ),
    this.laender$,
  ]).pipe(
    map(([{ translations }, laender]) => {
      const translated = laender
        .filter((code) => translations[`gesuch-app.shared.country.${code}`])
        .map((code) => ({
          code,
          text: translations[`gesuch-app.shared.country.${code}`],
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

  trackByIndex(index: number) {
    return index;
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['laender']?.currentValue) {
      this.laender$.next(changes['laender'].currentValue);
    }
  }
}
