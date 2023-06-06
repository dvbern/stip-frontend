import {FormBuilder, FormGroup} from "@angular/forms";
import {inject} from "@angular/core";

export abstract class SharedModelFormBase {
  private _group?: FormGroup;

  protected fb = inject(FormBuilder);
  protected initGroup(formControls: any): this {
    this._group = this.fb.group(formControls);
    return this;
  }

  get group()
    :
    FormGroup {
    return <FormGroup<any>>this._group;
  }
}
