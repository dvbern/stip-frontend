import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Input,
  inject,
  computed,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { selectSharedDataAccessGesuchsView } from '@dv/shared/data-access/gesuch';
import { Store } from '@ngrx/store';
import { TranslateModule } from '@ngx-translate/core';
import { RouterLink } from '@angular/router';

import { SharedPatternAppHeaderComponent } from '@dv/shared/pattern/app-header';
import { SharedPatternGesuchStepNavComponent } from '@dv/shared/pattern/gesuch-step-nav';
import { SharedUiSearchComponent } from '@dv/shared/ui/search';
import { SharedUiProgressBarComponent } from '@dv/shared/ui/progress-bar';
import { SharedUiIconChipComponent } from '@dv/shared/ui/icon-chip';
import { SharedModelGesuchFormStep } from '@dv/shared/model/gesuch-form';
import { SharedUtilGesuchFormStepManagerService } from '@dv/shared/util/gesuch-form-step-manager';

@Component({
  selector: 'dv-sachbearbeitung-app-pattern-gesuch-step-layout',
  standalone: true,
  imports: [
    CommonModule,
    RouterLink,
    SharedPatternGesuchStepNavComponent,
    SharedPatternAppHeaderComponent,
    SharedUiIconChipComponent,
    SharedUiProgressBarComponent,
    SharedUiSearchComponent,
    TranslateModule,
  ],
  templateUrl:
    './sachbearbeitung-app-pattern-gesuch-step-layout.component.html',
  styleUrls: [
    './sachbearbeitung-app-pattern-gesuch-step-layout.component.scss',
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SachbearbeitungAppPatternGesuchStepLayoutComponent {
  @Input()
  step?: SharedModelGesuchFormStep;
  navClicked = new EventEmitter();

  stepManager = inject(SharedUtilGesuchFormStepManagerService);
  private store = inject(Store);
  stepsSig = computed(() =>
    this.stepManager.getAllSteps(this.viewSig().gesuchFormular)
  );
  viewSig = this.store.selectSignal(selectSharedDataAccessGesuchsView);
}
