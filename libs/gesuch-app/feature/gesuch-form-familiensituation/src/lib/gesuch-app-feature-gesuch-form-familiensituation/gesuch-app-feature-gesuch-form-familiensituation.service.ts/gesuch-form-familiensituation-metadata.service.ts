import { Injectable } from '@angular/core';
import { AbstractControl, FormGroup } from '@angular/forms';
import { FamiliensituationDTO } from '@dv/shared/model/gesuch';

@Injectable({
  providedIn: 'root',
})
export class GesuchFormFamiliensituationMetadataService {
  visibilityMap = new Map<AbstractControl, boolean>();

  registerForm(form: FormGroup) {
    for (const controlName in form.controls) {
      if (Object.prototype.hasOwnProperty.call(form.controls, controlName)) {
        const control =
          form.controls[controlName as keyof FamiliensituationDTO];
        this.visibilityMap.set(control, false);
      }
    }
  }

  public setInvisible(control: AbstractControl): void {
    control.patchValue(null, { emitValue: true });
    control.disable();
    this.visibilityMap.set(control, false);
  }

  public setVisible(control: AbstractControl): void {
    this.visibilityMap.set(control, true);
    control.enable();
  }

  public isVisible(control: AbstractControl): boolean {
    if (!this.visibilityMap.has(control)) {
      return false;
    }
    return this.visibilityMap.get(control) as boolean;
  }
}
