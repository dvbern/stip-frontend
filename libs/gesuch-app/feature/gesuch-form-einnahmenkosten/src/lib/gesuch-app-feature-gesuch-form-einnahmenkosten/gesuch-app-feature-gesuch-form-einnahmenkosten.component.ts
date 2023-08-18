import {
  ChangeDetectionStrategy,
  Component,
  OnInit,
  computed,
  effect,
  inject,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatRadioModule } from '@angular/material/radio';
import { MaskitoModule } from '@maskito/angular';
import {
  NonNullableFormBuilder,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { Store } from '@ngrx/store';
import { TranslateModule } from '@ngx-translate/core';

import { GesuchAppPatternGesuchStepLayoutComponent } from '@dv/gesuch-app/pattern/gesuch-step-layout';
import { GesuchFormSteps } from '@dv/gesuch-app/model/gesuch-form';
import {
  SharedUiFormFieldDirective,
  SharedUiFormMessageErrorDirective,
} from '@dv/shared/ui/form';
import { maskitoNumber } from '@dv/shared/util/maskito-util';
import { GesuchAppEventGesuchFormEinnahmenkosten } from '@dv/gesuch-app/event/gesuch-form-einnahmenkosten';
import { GesuchAppUiStepFormButtonsComponent } from '@dv/gesuch-app/ui/step-form-buttons';

import { selectGesuchAppFeatureGesuchFormEinnahmenkostenView } from './gesuch-app-feature-gesuch-form-einnahmenkosten.selector';
import { SharedUtilFormService } from '@dv/shared/util/form';
import { getDateDifference } from '@dv/shared/util/validator-date';
import { NgbAlert } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'dv-gesuch-app-feature-gesuch-form-einnahmenkosten',
  standalone: true,
  imports: [
    CommonModule,
    TranslateModule,
    GesuchAppPatternGesuchStepLayoutComponent,
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
  templateUrl:
    './gesuch-app-feature-gesuch-form-einnahmenkosten.component.html',
  styleUrls: [
    './gesuch-app-feature-gesuch-form-einnahmenkosten.component.scss',
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class GesuchAppFeatureGesuchFormEinnahmenkostenComponent
  implements OnInit
{
  private store = inject(Store);
  private formBuilder = inject(NonNullableFormBuilder);
  private formService = inject(SharedUtilFormService);
  form = this.formBuilder.group({
    nettoerwerbseinkommen: [<number | null>null, [Validators.required]],
    alimente: [<number | null>null, [Validators.required]],
    zulagen: [<number | null>null, [Validators.required]],
    renten: [<number | null>null, [Validators.required]],
    eoLeistungen: [<number | null>null, []],
    ergaenzungsleistungen: [<number | null>null, []],
    beitraege: [<number | null>null, []],
    ausbildungskostenSekundarstufeZwei: [
      <number | null>null,
      [Validators.required],
    ],
    ausbildungskostenTertiaerstufe: [
      <number | null>null,
      [Validators.required],
    ],
    fahrkosten: [<number | null>null, [Validators.required]],
    wohnkosten: [<number | null>null, [Validators.required]],
    personenImHaushalt: [<number | null>null, [Validators.required]],
    verdienstRealisiert: [<boolean | null>null, [Validators.required]],
    willDarlehen: [<boolean | null>null, [Validators.required]],
  });
  viewSig = this.store.selectSignal(
    selectGesuchAppFeatureGesuchFormEinnahmenkostenView
  );
  maskitoNumber = maskitoNumber;
  formStateSig = computed(() => {
    const { gesuchFormular, ausbildungsstaettes } = this.viewSig();

    if (!gesuchFormular) {
      return {
        hasData: false as const,
        schritte: [
          GesuchFormSteps.PERSON.translationKey,
          GesuchFormSteps.AUSBILDUNG.translationKey,
          GesuchFormSteps.FAMILIENSITUATION.translationKey,
        ],
      };
    }
    const { personInAusbildung, familiensituation, kinds, ausbildung } =
      gesuchFormular;

    const schritte = [
      ...(!personInAusbildung ? [GesuchFormSteps.PERSON.translationKey] : []),
      ...(!ausbildung ? [GesuchFormSteps.AUSBILDUNG.translationKey] : []),
      ...(!familiensituation
        ? [GesuchFormSteps.FAMILIENSITUATION.translationKey]
        : []),
    ];

    if (!personInAusbildung || !familiensituation || !ausbildung) {
      return { hasData: false, schritte } as const;
    }
    const hatAlimente = familiensituation.werZahltAlimente !== 'GEMEINSAM';
    const hatElternteilVerloren =
      familiensituation.vaterUnbekanntVerstorben === 'VERSTORBEN' ||
      familiensituation.mutterUnbekanntVerstorben === 'VERSTORBEN';
    const hatKinder = kinds ? kinds.length > 0 : false;
    const istErwachsen =
      (getDateDifference(personInAusbildung.geburtsdatum, new Date())?.years ??
        0) > 18;
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
      },
      { allowSignalWrites: true }
    );
  }

  ngOnInit() {
    this.store.dispatch(GesuchAppEventGesuchFormEinnahmenkosten.init());
  }

  trackByIndex(index: number) {
    return index;
  }

  handleSave(): void {
    this.form.markAllAsTouched();
    const { gesuchId, gesuchFormular } = this.buildUpdatedGesuchFromForm();
    if (this.form.valid && gesuchId) {
      this.store.dispatch(
        GesuchAppEventGesuchFormEinnahmenkosten.saveTriggered({
          gesuchId,
          gesuchFormular,
          origin: GesuchFormSteps.EINNAHMEN_KOSTEN,
        })
      );
    }
  }

  private buildUpdatedGesuchFromForm() {
    const { gesuch, gesuchFormular } = this.viewSig();
    return {
      gesuchId: gesuch?.id,
      gesuchFormular: {
        ...gesuchFormular,
        einnahmenkosten: {
          ...this.form.getRawValue(),
        },
      },
    };
  }

  protected readonly GesuchFormSteps = GesuchFormSteps;
}
