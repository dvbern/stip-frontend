import {SharedModelFormBase} from "@dv/shared/model/form-base";
import {FormBuilder, Validators} from "@angular/forms";
import {inject} from "@angular/core";


export class ElternForm  extends SharedModelFormBase {

  constructor(
  ) {
    super();
    this.build();
  }

  private build(): void {
    this.initGroup({
      name: [undefined, Validators.required],
      vorname: [undefined, Validators.required],
    });
  }
}
