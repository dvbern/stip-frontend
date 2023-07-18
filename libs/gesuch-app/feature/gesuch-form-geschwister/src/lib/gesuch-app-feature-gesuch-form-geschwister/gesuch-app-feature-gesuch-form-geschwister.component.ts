import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
  OnInit,
} from '@angular/core';
import { selectGesuchAppDataAccessGesuchsView } from '@dv/gesuch-app/data-access/gesuch';
import { GesuchAppEventGesuchFormGeschwister } from '@dv/gesuch-app/event/gesuch-form-geschwister';
import { GesuchFormSteps } from '@dv/gesuch-app/model/gesuch-form';
import { GesuchAppPatternGesuchStepLayoutComponent } from '@dv/gesuch-app/pattern/gesuch-step-layout';
import { GesuchAppUiStepFormButtonsComponent } from '@dv/gesuch-app/ui/step-form-buttons';
import { GeschwisterUpdate } from '@dv/shared/model/gesuch';
import { NgbAlert } from '@ng-bootstrap/ng-bootstrap';
import { Store } from '@ngrx/store';
import { TranslateModule } from '@ngx-translate/core';
import { GesuchAppFeatureGesuchFormGeschwisterEditorComponent } from '../gesuch-app-feature-gesuch-form-geschwister-editor/gesuch-app-feature-gesuch-form-geschwister-editor.component';
import { parseBackendLocalDateAndPrint } from '@dv/shared/util/validator-date';
import { selectLanguage } from '@dv/shared/data-access/language';

@Component({
  selector: 'dv-gesuch-app-feature-gesuch-form-geschwister',
  standalone: true,
  imports: [
    CommonModule,
    GesuchAppPatternGesuchStepLayoutComponent,
    TranslateModule,
    NgbAlert,
    GesuchAppFeatureGesuchFormGeschwisterEditorComponent,
    GesuchAppUiStepFormButtonsComponent,
  ],
  templateUrl: './gesuch-app-feature-gesuch-form-geschwister.component.html',
  styleUrls: ['./gesuch-app-feature-gesuch-form-geschwister.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class GesuchAppFeatureGesuchFormGeschwisterComponent implements OnInit {
  private store = inject(Store);

  view$ = this.store.selectSignal(selectGesuchAppDataAccessGesuchsView);

  languageSig = this.store.selectSignal(selectLanguage);

  parseBackendLocalDateAndPrint = parseBackendLocalDateAndPrint;

  sortedGeschwistersSig = computed(() => {
    const originalList = this.view$().gesuchFormular?.geschwisters;
    return originalList
      ? [...originalList].sort((a, b) =>
          (a.vorname + ' ' + a.nachname).localeCompare(
            b.vorname + ' ' + b.nachname
          )
        )
      : undefined;
  });

  protected readonly GesuchFormSteps = GesuchFormSteps;

  editedGeschwister?: Partial<GeschwisterUpdate>;

  ngOnInit(): void {
    this.store.dispatch(GesuchAppEventGesuchFormGeschwister.init());
  }

  public handleAddGeschwister(): void {
    this.editedGeschwister = {};
  }

  public handleEditGeschwister(ge: GeschwisterUpdate): void {
    this.editedGeschwister = ge;
  }

  handleEditorSave(geschwister: GeschwisterUpdate) {
    const { gesuchId, gesuchFormular } =
      this.buildUpdatedGesuchWithUpdatedGeschwister(geschwister);
    if (gesuchId) {
      this.store.dispatch(
        GesuchAppEventGesuchFormGeschwister.saveSubformTriggered({
          gesuchId,
          gesuchFormular,
          origin: GesuchFormSteps.GESCHWISTER,
        })
      );
      this.editedGeschwister = undefined;
    }
  }

  public handleDeleteGeschwister(geschwister: GeschwisterUpdate) {
    const { gesuchId, gesuchFormular } =
      this.buildUpdatedGesuchWithDeletedGeschwister(geschwister);
    if (gesuchId) {
      this.store.dispatch(
        GesuchAppEventGesuchFormGeschwister.saveSubformTriggered({
          gesuchId,
          gesuchFormular,
          origin: GesuchFormSteps.GESCHWISTER,
        })
      );
      this.editedGeschwister = undefined;
    }
  }

  handleContinue() {
    const { gesuch } = this.view$();
    if (gesuch?.id) {
      this.store.dispatch(
        GesuchAppEventGesuchFormGeschwister.nextTriggered({
          id: gesuch.id,
          origin: GesuchFormSteps.GESCHWISTER,
        })
      );
    }
  }

  handleEditorClose() {
    this.editedGeschwister = undefined;
  }

  private buildUpdatedGesuchWithDeletedGeschwister(
    geschwister: GeschwisterUpdate
  ) {
    const { gesuch, gesuchFormular } = this.view$();
    const updatedGeschwisterContainers = gesuchFormular?.geschwisters?.filter(
      (geschwisters) => geschwisters.id !== geschwister.id
    );

    return {
      gesuchId: gesuch?.id,
      gesuchFormular: {
        ...gesuchFormular,
        geschwisters: updatedGeschwisterContainers,
      },
    };
  }

  private buildUpdatedGesuchWithUpdatedGeschwister(
    geschwister: GeschwisterUpdate
  ) {
    const { gesuch, gesuchFormular } = this.view$();
    // update existing geschwister if found
    const updatedGeschwisters =
      gesuchFormular?.geschwisters?.map((oldGeschwister) => {
        if (oldGeschwister.id === geschwister.id) {
          return geschwister;
        } else {
          return oldGeschwister;
        }
      }) ?? [];
    // add new geschwister if not found
    if (!geschwister.id) {
      updatedGeschwisters.push(geschwister);
    }
    return {
      gesuchId: gesuch?.id,
      gesuchFormular: {
        ...gesuchFormular,
        geschwisters: updatedGeschwisters,
      },
    };
  }

  trackByIndex(index: number) {
    return index;
  }

  public asGeschwister(geschwisterRaw: GeschwisterUpdate) {
    return geschwisterRaw;
  }
}
