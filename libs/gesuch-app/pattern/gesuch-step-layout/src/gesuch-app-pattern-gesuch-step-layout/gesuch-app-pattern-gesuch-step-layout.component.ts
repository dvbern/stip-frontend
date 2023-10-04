import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  computed,
  EventEmitter,
  inject,
  Input,
} from '@angular/core';
import { RouterLink } from '@angular/router';
import { selectSharedDataAccessGesuchsView } from '@dv/shared/data-access/gesuch';
import { Store } from '@ngrx/store';
import { TranslateModule } from '@ngx-translate/core';

import { GesuchAppPatternMainLayoutComponent } from '@dv/gesuch-app/pattern/main-layout';
import { SharedModelGesuchFormStep } from '@dv/shared/model/gesuch-form';
import { SharedUtilGesuchFormStepManagerService } from '@dv/shared/util/gesuch-form-step-manager';
import { SharedPatternGesuchStepNavComponent } from '@dv/shared/pattern/gesuch-step-nav';
import {
  selectLanguage,
  SharedDataAccessLanguageEvents,
} from '@dv/shared/data-access/language';
import { Language } from '@dv/shared/model/language';
import { SharedUiIconChipComponent } from '@dv/shared/ui/icon-chip';
import { SharedUiLanguageSelectorComponent } from '@dv/shared/ui/language-selector';
import { SharedUiProgressBarComponent } from '@dv/shared/ui/progress-bar';

@Component({
  selector: 'dv-gesuch-app-pattern-gesuch-step-layout',
  standalone: true,
  imports: [
    CommonModule,
    SharedPatternGesuchStepNavComponent,
    SharedUiProgressBarComponent,
    TranslateModule,
    SharedUiIconChipComponent,
    SharedUiLanguageSelectorComponent,
    GesuchAppPatternMainLayoutComponent,
    RouterLink,
  ],
  templateUrl: './gesuch-app-pattern-gesuch-step-layout.component.html',
  styleUrls: ['./gesuch-app-pattern-gesuch-step-layout.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class GesuchAppPatternGesuchStepLayoutComponent {
  @Input()
  step?: SharedModelGesuchFormStep;

  navClicked = new EventEmitter();

  private store = inject(Store);

  stepManager = inject(SharedUtilGesuchFormStepManagerService);
  languageSig = this.store.selectSignal(selectLanguage);
  viewSig = this.store.selectSignal(selectSharedDataAccessGesuchsView);
  stepsSig = computed(() =>
    this.stepManager.getAllSteps(this.viewSig().gesuchFormular)
  );

  handleLanguageChangeHeader(language: Language) {
    this.store.dispatch(
      SharedDataAccessLanguageEvents.headerMenuSelectorChange({ language })
    );
  }
}
