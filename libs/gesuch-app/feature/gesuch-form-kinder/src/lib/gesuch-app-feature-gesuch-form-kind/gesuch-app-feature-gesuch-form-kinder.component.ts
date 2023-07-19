import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
  OnInit,
} from '@angular/core';
import { selectGesuchAppDataAccessGesuchsView } from '@dv/gesuch-app/data-access/gesuch';
import { GesuchAppEventGesuchFormKinder } from '@dv/gesuch-app/event/gesuch-form-kinder';
import { GesuchFormSteps } from '@dv/gesuch-app/model/gesuch-form';
import { GesuchAppPatternGesuchStepLayoutComponent } from '@dv/gesuch-app/pattern/gesuch-step-layout';
import { GesuchAppUiStepFormButtonsComponent } from '@dv/gesuch-app/ui/step-form-buttons';
import { KindUpdate } from '@dv/shared/model/gesuch';
import { NgbAlert } from '@ng-bootstrap/ng-bootstrap';
import { Store } from '@ngrx/store';
import { TranslateModule } from '@ngx-translate/core';
import { GesuchAppFeatureGesuchFormKinderEditorComponent } from '../gesuch-app-feature-gesuch-form-kind-editor/gesuch-app-feature-gesuch-form-kind-editor.component';
import { selectLanguage } from '@dv/shared/data-access/language';
import { parseBackendLocalDateAndPrint } from '@dv/shared/util/validator-date';

@Component({
  selector: 'dv-gesuch-app-feature-gesuch-form-kinder',
  standalone: true,
  imports: [
    CommonModule,
    GesuchAppPatternGesuchStepLayoutComponent,
    TranslateModule,
    NgbAlert,
    GesuchAppFeatureGesuchFormKinderEditorComponent,
    GesuchAppUiStepFormButtonsComponent,
  ],
  templateUrl: './gesuch-app-feature-gesuch-form-kinder.component.html',
  styleUrls: ['./gesuch-app-feature-gesuch-form-kinder.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class GesuchAppFeatureGesuchFormKinderComponent implements OnInit {
  private store = inject(Store);

  view$ = this.store.selectSignal(selectGesuchAppDataAccessGesuchsView);

  languageSig = this.store.selectSignal(selectLanguage);

  parseBackendLocalDateAndPrint = parseBackendLocalDateAndPrint;

  sortedKinderSig = computed(() => {
    const originalList = this.view$().gesuchFormular?.kinds;
    return originalList
      ? [...originalList].sort((a, b) =>
          (a.vorname + ' ' + a.nachname).localeCompare(
            b.vorname + ' ' + b.nachname
          )
        )
      : undefined;
  });
  protected readonly GesuchFormSteps = GesuchFormSteps;

  editedKind?: Partial<KindUpdate>;

  ngOnInit(): void {
    this.store.dispatch(GesuchAppEventGesuchFormKinder.init());
  }

  public handleAddKinder(): void {
    this.editedKind = {};
  }

  public handleEditKinder(ge: KindUpdate): void {
    this.editedKind = ge;
  }

  handleEditorSave(kind: KindUpdate) {
    const { gesuchId, gesuchFormular } =
      this.buildUpdatedGesuchWithUpdatedKind(kind);
    if (gesuchId) {
      this.store.dispatch(
        GesuchAppEventGesuchFormKinder.saveSubformTriggered({
          gesuchId,
          gesuchFormular,
          origin: GesuchFormSteps.KINDER,
        })
      );
      this.editedKind = undefined;
    }
  }

  public handleDeleteKinder(kind: KindUpdate) {
    const { gesuchId, gesuchFormular } =
      this.buildUpdatedGesuchWithDeletedKinder(kind);
    if (gesuchId) {
      this.store.dispatch(
        GesuchAppEventGesuchFormKinder.saveSubformTriggered({
          gesuchId,
          gesuchFormular,
          origin: GesuchFormSteps.KINDER,
        })
      );
      this.editedKind = undefined;
    }
  }

  handleContinue() {
    const { gesuch } = this.view$();
    if (gesuch?.id)
      this.store.dispatch(
        GesuchAppEventGesuchFormKinder.nextTriggered({
          id: gesuch.id,
          origin: GesuchFormSteps.KINDER,
        })
      );
  }

  handleEditorClose() {
    this.editedKind = undefined;
  }

  private buildUpdatedGesuchWithDeletedKinder(kind: KindUpdate) {
    const { gesuch, gesuchFormular } = this.view$();
    const updatedKinders = gesuchFormular?.kinds?.filter(
      (entry) => entry.id !== kind.id
    );

    return {
      gesuchId: gesuch?.id,
      gesuchFormular: {
        ...gesuchFormular,
        kinds: updatedKinders,
      },
    };
  }

  private buildUpdatedGesuchWithUpdatedKind(kind: KindUpdate) {
    const { gesuch, gesuchFormular } = this.view$();
    // update existing kind if found
    const updatedKinders =
      gesuchFormular?.kinds?.map((oldKind) => {
        if (oldKind?.id === kind.id) {
          return kind;
        } else {
          return oldKind;
        }
      }) ?? [];
    // add new kind if not found
    if (!kind.id) {
      updatedKinders.push(kind);
    }
    return {
      gesuchId: gesuch?.id,
      gesuchFormular: {
        ...gesuchFormular,
        kinds: updatedKinders,
      },
    };
  }

  trackByIndex(index: number) {
    return index;
  }
}
