import { Injectable } from '@angular/core';
import {
  FormControl,
  FormGroup,
  ɵFormGroupValue,
  ɵTypedOrUntyped,
} from '@angular/forms';
import {
  ElternAbwesenheitsGrund,
  Elternschaftsteilung,
  FamiliensituationDTO,
} from '@dv/shared/model/gesuch';
import { GesuchFamiliensituationForm } from '../gesuch-familiensituation-form';

// Metadata type for the form group
type FormGroupMetadata<T> = {
  [K in keyof T]: {
    control: FormControl | undefined;
    visible: boolean;
    // Add more metadata properties as needed
  };
};

@Injectable({
  providedIn: 'root',
})
export class GesuchFormFamiliensituationMetadataService {
  private state: FormGroupMetadata<GesuchFamiliensituationForm> = {
    leiblicheElternVerheiratetKonkubinat: {
      control: undefined,
      visible: true,
    },
    elternteilVerstorben: { control: undefined, visible: false },
    elternteilVerstorbenUnbekannt: { control: undefined, visible: false },
    gerichtlicheAlimentenregelung: { control: undefined, visible: false },
    mutterUnbekanntVerstorben: { control: undefined, visible: false },
    mutterUnbekanntReason: { control: undefined, visible: false },
    mutterWiederverheiratet: { control: undefined, visible: false },
    obhut: { control: undefined, visible: false },
    obhutMutter: { control: undefined, visible: false },
    obhutVater: { control: undefined, visible: false },
    sorgerecht: { control: undefined, visible: false },
    vaterUnbekanntVerstorben: { control: undefined, visible: false },
    vaterUnbekanntReason: { control: undefined, visible: false },
    vaterWiederverheiratet: { control: undefined, visible: false },
    werZahltAlimente: { control: undefined, visible: false },
  };

  registerForm(form: FormGroup<GesuchFamiliensituationForm>) {
    for (const controlName in form.controls) {
      if (Object.prototype.hasOwnProperty.call(form.controls, controlName)) {
        const control =
          form.controls[controlName as keyof GesuchFamiliensituationForm];
        this.state[controlName as keyof GesuchFamiliensituationForm] = {
          ...this.state[controlName as keyof GesuchFamiliensituationForm],
          control,
        };
      }
    }
    this.update(form.value);
  }

  update(currentFormValues: Partial<FamiliensituationDTO>): void {
    if (currentFormValues.leiblicheElternVerheiratetKonkubinat === true) {
      this.setInvisible(
        'mutterWiederverheiratet',
        'vaterWiederverheiratet',
        'gerichtlicheAlimentenregelung',
        'elternteilVerstorbenUnbekannt',
        'mutterUnbekanntVerstorben',
        'vaterUnbekanntVerstorben',
        'mutterUnbekanntReason',
        'vaterUnbekanntReason',
        'obhut',
        'obhutVater',
        'obhutMutter',
        'sorgerecht'
      );
    }
    if (currentFormValues.leiblicheElternVerheiratetKonkubinat === false) {
      this.setVisible('gerichtlicheAlimentenregelung');
      if (currentFormValues.gerichtlicheAlimentenregelung === true) {
        this.setVisible('werZahltAlimente');
        this.setInvisible(
          'mutterWiederverheiratet',
          'vaterWiederverheiratet',
          'elternteilVerstorbenUnbekannt',
          'mutterUnbekanntVerstorben',
          'vaterUnbekanntVerstorben',
          'mutterUnbekanntReason',
          'vaterUnbekanntReason',
          'obhut',
          'obhutVater',
          'obhutMutter',
          'sorgerecht'
        );
      }
      if (currentFormValues.gerichtlicheAlimentenregelung === false) {
        this.setVisible('elternteilVerstorbenUnbekannt');
        this.setInvisible('werZahltAlimente');
        this.handleLeiblicheElternVerheiratetKonkubinatTrue(currentFormValues);
      }
    }

    this.resetInvisibleFormFields();
  }

  private handleLeiblicheElternVerheiratetKonkubinatTrue(
    currentFormValues: Partial<FamiliensituationDTO>
  ): void {
    if (currentFormValues.elternteilVerstorbenUnbekannt === true) {
      this.handleElternteilVerstorbenUnbekanntTrue(currentFormValues);
    }
    if (currentFormValues.elternteilVerstorbenUnbekannt === false) {
      this.handleElternteilVerstorbenUnbekanntFalse(currentFormValues);
    }
  }

  private handleElternteilVerstorbenUnbekanntFalse(
    currentFormValues: Partial<FamiliensituationDTO>
  ): void {
    this.setInvisible(
      'mutterUnbekanntVerstorben',
      'vaterUnbekanntVerstorben',
      'mutterUnbekanntReason',
      'vaterUnbekanntReason'
    );
    this.setVisible(
      'vaterWiederverheiratet',
      'mutterWiederverheiratet',
      'sorgerecht',
      'obhut',
      'obhutVater',
      'obhutMutter'
    );

    if (currentFormValues.obhut === Elternschaftsteilung.GEMEINSAM) {
      this.setVisible('obhutVater', 'obhutMutter');
    } else {
      this.setInvisible('obhutMutter', 'obhutVater');
    }
  }

  private handleElternteilVerstorbenUnbekanntTrue(
    currentFormValues: Partial<FamiliensituationDTO>
  ): void {
    this.setVisible('mutterUnbekanntVerstorben', 'vaterUnbekanntVerstorben');
    this.setInvisible(
      'vaterWiederverheiratet',
      'mutterWiederverheiratet',
      'sorgerecht',
      'obhut'
    );

    if (
      currentFormValues.mutterUnbekanntVerstorben ===
      ElternAbwesenheitsGrund.UNBEKANNT
    ) {
      this.setVisible('mutterUnbekanntReason');
      this.setInvisible('mutterWiederverheiratet');
    }

    if (
      currentFormValues.vaterUnbekanntVerstorben ===
      ElternAbwesenheitsGrund.UNBEKANNT
    ) {
      this.setVisible('vaterUnbekanntReason');
      this.setInvisible('vaterWiederverheiratet');
    }

    if (
      currentFormValues.mutterUnbekanntVerstorben ===
      ElternAbwesenheitsGrund.VERSTORBEN
    ) {
      this.setInvisible('mutterUnbekanntReason');
    }

    if (
      currentFormValues.vaterUnbekanntVerstorben ===
      ElternAbwesenheitsGrund.VERSTORBEN
    ) {
      this.setInvisible('vaterUnbekanntReason');
    }

    if (
      currentFormValues.mutterUnbekanntVerstorben ===
      ElternAbwesenheitsGrund.WEDER_NOCH
    ) {
      this.setVisible('mutterWiederverheiratet');
      this.setInvisible('mutterUnbekanntReason');
    }
    if (
      currentFormValues.vaterUnbekanntVerstorben ===
      ElternAbwesenheitsGrund.WEDER_NOCH
    ) {
      this.setVisible('vaterWiederverheiratet');
      this.setInvisible('vaterUnbekanntReason');
    }
  }

  private setVisible(
    ...controlNames: (keyof GesuchFamiliensituationForm)[]
  ): void {
    for (const controlName of controlNames) {
      this.state[controlName].visible = true;
      const control = this.state[controlName].control;
      if (this.isNullOrUndefined(control)) {
        console.warn('wrong config, form not registered');
        return;
      }
      control.enable({ emitEvent: false });
    }
  }

  private setInvisible(
    ...controlNames: (keyof GesuchFamiliensituationForm)[]
  ): void {
    for (const controlName of controlNames) {
      this.state[controlName].visible = false;
      const control = this.state[controlName].control;
      if (this.isNullOrUndefined(control)) {
        console.warn('wrong config, form not registered');
        return;
      }
      // control.disable({emitEvent: false});
    }
  }

  private isNullOrUndefined<T>(
    val: T | undefined | null
  ): val is null | undefined {
    return val === undefined || val === null;
  }

  public isVisible(
    formControlName: keyof GesuchFamiliensituationForm
  ): boolean {
    return this.state[formControlName].visible;
  }

  private resetInvisibleFormFields(): void {
    for (const controlName in this.state) {
      if (Object.prototype.hasOwnProperty.call(this.state, controlName)) {
        const controlMetadata: {
          control: FormControl | undefined;
          visible: boolean;
        } = this.state[controlName as keyof GesuchFamiliensituationForm];
        if (this.isNullOrUndefined(controlMetadata.control)) {
          console.warn('wrong config, form not registered');
          return;
        }
        if (!controlMetadata.visible) {
          controlMetadata.control.patchValue(null, { emitEvent: false });
        }
      }
    }
  }

  public markVisibleFormControlsAsTouched(): void {
    for (const controlName in this.state) {
      if (Object.prototype.hasOwnProperty.call(this.state, controlName)) {
        const controlMetadata =
          this.state[controlName as keyof GesuchFamiliensituationForm];
        if (this.isNullOrUndefined(controlMetadata.control)) {
          console.warn('wrong config, form not registered');
          return;
        }
        if (controlMetadata.visible) {
          controlMetadata.control.markAsTouched({ onlySelf: true });
        }
      }
    }
  }
}
