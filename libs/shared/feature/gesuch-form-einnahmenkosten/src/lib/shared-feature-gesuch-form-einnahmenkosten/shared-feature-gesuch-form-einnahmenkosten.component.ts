import {
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  OnInit,
  computed,
  effect,
  inject,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatRadioModule } from '@angular/material/radio';
import { sharedUtilValidatorRange } from '@dv/shared/util/validator-range';
import { MaskitoModule } from '@maskito/angular';
import { NgbAlert } from '@ng-bootstrap/ng-bootstrap';
import {
  NonNullableFormBuilder,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { Store } from '@ngrx/store';
import { TranslateModule } from '@ngx-translate/core';

import {
  AUSBILDUNG,
  EINNAHMEN_KOSTEN,
  FAMILIENSITUATION,
  PERSON,
} from '@dv/shared/model/gesuch-form';
import {
  SharedUiFormFieldDirective,
  SharedUiFormMessageErrorDirective,
} from '@dv/shared/ui/form';
import {
  fromFormatedNumber,
  maskitoNumber,
  maskitoPositiveNumber,
} from '@dv/shared/util/maskito-util';
import { SharedEventGesuchFormEinnahmenkosten } from '@dv/shared/event/gesuch-form-einnahmenkosten';
import { GesuchAppUiStepFormButtonsComponent } from '@dv/shared/ui/step-form-buttons';
import {
  convertTempFormToRealValues,
  SharedUtilFormService,
} from '@dv/shared/util/form';
import { selectLanguage } from '@dv/shared/data-access/language';
import {
  getDateDifference,
  parseBackendLocalDateAndPrint,
} from '@dv/shared/util/validator-date';
import { selectSharedFeatureGesuchFormEinnahmenkostenView } from './shared-feature-gesuch-form-einnahmenkosten.selector';

@Component({
  selector: 'dv-shared-feature-gesuch-form-einnahmenkosten',
  standalone: true,
  imports: [
    CommonModule,
    TranslateModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatRadioModule,
    MaskitoModule,
    NgbAlert,
    SharedUiFormFieldDirective,
    SharedUiFormMessageErrorDirective,
    GesuchAppUiStepFormButtonsComponent,
  ],
  templateUrl: './shared-feature-gesuch-form-einnahmenkosten.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SharedFeatureGesuchFormEinnahmenkostenComponent implements OnInit {
  private store = inject(Store);
  private formBuilder = inject(NonNullableFormBuilder);
  private formService = inject(SharedUtilFormService);
  private elementRef = inject(ElementRef);
  form = this.formBuilder.group({
    nettoerwerbseinkommen: [<string | null>null, [Validators.required]],
    alimente: [<string | null>null, [Validators.required]],
    zulagen: [<string | null>null, [Validators.required]],
    renten: [<string | null>null, [Validators.required]],
    eoLeistungen: [<string | undefined>undefined, []],
    ergaenzungsleistungen: [<string | undefined>undefined, []],
    beitraege: [<string | undefined>undefined, []],
    ausbildungskostenSekundarstufeZwei: [
      <string | null>null,
      [Validators.required],
    ],
    ausbildungskostenTertiaerstufe: [
      <string | null>null,
      [Validators.required],
    ],
    fahrkosten: [<string | null>null, [Validators.required]],
    wohnkosten: [<string | null>null, [Validators.required]],
    personenImHaushalt: [<string | null>null, [Validators.required]],
    verdienstRealisiert: [<boolean | null>null, [Validators.required]],
    willDarlehen: [<boolean | null>null, [Validators.required]],
    auswaertigeMittagessenProWoche: [
      <number | null>null,
      [Validators.required, sharedUtilValidatorRange(0, 5)],
    ],
  });
  viewSig = this.store.selectSignal(
    selectSharedFeatureGesuchFormEinnahmenkostenView
  );
  languageSig = this.store.selectSignal(selectLanguage);
  maskitoNumber = maskitoNumber;
  maskitoPositiveNumber = maskitoPositiveNumber;
  formStateSig = computed(() => {
    const { gesuchFormular, ausbildungsstaettes } = this.viewSig();

    if (!gesuchFormular) {
      return {
        hasData: false as const,
        schritte: [
          PERSON.translationKey,
          AUSBILDUNG.translationKey,
          FAMILIENSITUATION.translationKey,
        ],
      };
    }
    const { personInAusbildung, familiensituation, kinds, ausbildung } =
      gesuchFormular;

    const schritte = [
      ...(!personInAusbildung ? [PERSON.translationKey] : []),
      ...(!ausbildung ? [AUSBILDUNG.translationKey] : []),
      ...(!familiensituation ? [FAMILIENSITUATION.translationKey] : []),
    ];

    if (!personInAusbildung || !familiensituation || !ausbildung) {
      return { hasData: false, schritte } as const;
    }
    const hatAlimente = familiensituation.werZahltAlimente !== 'GEMEINSAM';
    const hatElternteilVerloren =
      familiensituation.vaterUnbekanntVerstorben === 'VERSTORBEN' ||
      familiensituation.mutterUnbekanntVerstorben === 'VERSTORBEN';
    const hatKinder = kinds ? kinds.length > 0 : false;
    const geburtsdatum = parseBackendLocalDateAndPrint(
      personInAusbildung.geburtsdatum,
      this.languageSig()
    );
    const istErwachsen = !geburtsdatum
      ? false
      : (getDateDifference(geburtsdatum, new Date())?.years ?? 0) > 18;
    // TODO: Use stammdaten info once available
    const ausbildungsgang = ausbildungsstaettes
      .find((a) =>
        a.ausbildungsgaenge?.some((g) => g.id === ausbildung.ausbildungsgangId)
      )
      ?.ausbildungsgaenge?.find((a) => a.id === ausbildung.ausbildungsgangId);
    const willSekundarstufeZwei = ausbildungsgang?.bezeichnungDe === 'Bachelor';
    const willTertiaerstufe = ausbildungsgang?.bezeichnungDe === 'Master';

    return {
      hasData: true,
      hatAlimente,
      hatElternteilVerloren,
      hatKinder,
      willSekundarstufeZwei,
      willTertiaerstufe,
      istErwachsen,
    } as const;
  });

  view$ = this.store.selectSignal(
    selectSharedFeatureGesuchFormEinnahmenkostenView
  );

  constructor() {
    effect(
      () => {
        const {
          hasData,
          hatAlimente,
          hatElternteilVerloren,
          hatKinder,
          willSekundarstufeZwei,
          willTertiaerstufe,
          istErwachsen,
        } = this.formStateSig();
        const {
          wohnsitzNotEigenerHaushalt,
          existiertGerichtlicheAlimentenregelung,
        } = this.viewSig();

        if (!hasData) {
          return;
        }

        this.formService.setDisabledState(
          this.form.controls.alimente,
          !hatAlimente,
          true
        );

        this.formService.setDisabledState(
          this.form.controls.renten,
          !hatElternteilVerloren,
          true
        );

        this.formService.setDisabledState(
          this.form.controls.zulagen,
          !hatKinder,
          true
        );

        this.formService.setDisabledState(
          this.form.controls.ausbildungskostenSekundarstufeZwei,
          !willSekundarstufeZwei,
          true
        );

        this.formService.setDisabledState(
          this.form.controls.ausbildungskostenTertiaerstufe,
          !willTertiaerstufe,
          true
        );

        this.formService.setDisabledState(
          this.form.controls.willDarlehen,
          !istErwachsen,
          true
        );

        this.formService.setDisabledState(
          this.form.controls.auswaertigeMittagessenProWoche,
          !wohnsitzNotEigenerHaushalt,
          true
        );

        this.formService.setDisabledState(
          this.form.controls.wohnkosten,
          wohnsitzNotEigenerHaushalt,
          true
        );

        this.formService.setDisabledState(
          this.form.controls.personenImHaushalt,
          wohnsitzNotEigenerHaushalt,
          true
        );

        this.formService.setDisabledState(
          this.form.controls.alimente,
          !existiertGerichtlicheAlimentenregelung,
          true
        );
      },
      { allowSignalWrites: true }
    );

    // fill form
    effect(
      () => {
        const { einnahmenKosten } = this.view$();
        if (einnahmenKosten) {
          this.form.patchValue({
            ...einnahmenKosten,
            nettoerwerbseinkommen:
              einnahmenKosten.nettoerwerbseinkommen.toString(),
            alimente: einnahmenKosten.alimente?.toString(),
            zulagen: einnahmenKosten.zulagen?.toString(),
            renten: einnahmenKosten.renten?.toString(),
            eoLeistungen: einnahmenKosten.eoLeistungen?.toString(),
            ergaenzungsleistungen:
              einnahmenKosten.ergaenzungsleistungen?.toString(),
            beitraege: einnahmenKosten.beitraege?.toString(),
            ausbildungskostenSekundarstufeZwei:
              einnahmenKosten.ausbildungskostenSekundarstufeZwei?.toString(),
            ausbildungskostenTertiaerstufe:
              einnahmenKosten.ausbildungskostenTertiaerstufe?.toString(),
            fahrkosten: einnahmenKosten.fahrkosten.toString(),
            wohnkosten: einnahmenKosten.wohnkosten.toString(),
            personenImHaushalt: einnahmenKosten.personenImHaushalt.toString(),
          });
        } else {
          this.form.reset();
        }
      },
      { allowSignalWrites: true }
    );
  }

  ngOnInit() {
    this.store.dispatch(SharedEventGesuchFormEinnahmenkosten.init());
  }

  trackByIndex(index: number) {
    return index;
  }

  handleSave(): void {
    this.form.markAllAsTouched();
    this.formService.focusFirstInvalid(this.elementRef);
    const { gesuchId, gesuchFormular } = this.buildUpdatedGesuchFromForm();
    if (this.form.valid && gesuchId) {
      this.store.dispatch(
        SharedEventGesuchFormEinnahmenkosten.saveTriggered({
          gesuchId,
          gesuchFormular,
          origin: EINNAHMEN_KOSTEN,
        })
      );
    }
  }

  private buildUpdatedGesuchFromForm() {
    const { gesuch, gesuchFormular } = this.viewSig();
    const formValues = convertTempFormToRealValues(this.form, [
      'nettoerwerbseinkommen',
      'alimente',
      'zulagen',
      'renten',
      'ausbildungskostenSekundarstufeZwei',
      'ausbildungskostenTertiaerstufe',
      'fahrkosten',
      'wohnkosten',
      'personenImHaushalt',
      'verdienstRealisiert',
      'willDarlehen',
      'auswaertigeMittagessenProWoche',
    ]);
    return {
      gesuchId: gesuch?.id,
      gesuchFormular: {
        ...gesuchFormular,
        einnahmenKosten: {
          ...formValues,
          nettoerwerbseinkommen: fromFormatedNumber(
            formValues.nettoerwerbseinkommen
          ),
          alimente: fromFormatedNumber(formValues.alimente),
          zulagen: fromFormatedNumber(formValues.zulagen),
          renten: fromFormatedNumber(formValues.renten),
          eoLeistungen: fromFormatedNumber(formValues.eoLeistungen),
          ergaenzungsleistungen: fromFormatedNumber(
            formValues.ergaenzungsleistungen
          ),
          beitraege: fromFormatedNumber(formValues.beitraege),
          ausbildungskostenSekundarstufeZwei: fromFormatedNumber(
            formValues.ausbildungskostenSekundarstufeZwei
          ),
          ausbildungskostenTertiaerstufe: fromFormatedNumber(
            formValues.ausbildungskostenTertiaerstufe
          ),
          fahrkosten: fromFormatedNumber(formValues.fahrkosten),
          wohnkosten: fromFormatedNumber(formValues.wohnkosten),
          personenImHaushalt: fromFormatedNumber(formValues.personenImHaushalt),
        },
      },
    };
  }
}
