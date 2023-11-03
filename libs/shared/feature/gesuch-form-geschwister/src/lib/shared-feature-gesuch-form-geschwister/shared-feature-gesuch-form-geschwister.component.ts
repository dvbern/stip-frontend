import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
  OnInit,
} from '@angular/core';
import { NgbAlert } from '@ng-bootstrap/ng-bootstrap';
import { Store } from '@ngrx/store';
import { TranslateModule } from '@ngx-translate/core';

import { selectSharedDataAccessGesuchsView } from '@dv/shared/data-access/gesuch';
import { SharedEventGesuchFormGeschwister } from '@dv/shared/event/gesuch-form-geschwister';
import { GESCHWISTER } from '@dv/shared/model/gesuch-form';
import { GesuchAppUiStepFormButtonsComponent } from '@dv/shared/ui/step-form-buttons';
import { GeschwisterUpdate } from '@dv/shared/model/gesuch';
import { parseBackendLocalDateAndPrint } from '@dv/shared/util/validator-date';
import { selectLanguage } from '@dv/shared/data-access/language';

import { SharedFeatureGesuchFormGeschwisterEditorComponent } from '../shared-feature-gesuch-form-geschwister-editor/shared-feature-gesuch-form-geschwister-editor.component';

@Component({
  selector: 'dv-shared-feature-gesuch-form-geschwister',
  standalone: true,
  imports: [
    CommonModule,
    TranslateModule,
    NgbAlert,
    SharedFeatureGesuchFormGeschwisterEditorComponent,
    GesuchAppUiStepFormButtonsComponent,
  ],
  templateUrl: './shared-feature-gesuch-form-geschwister.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SharedFeatureGesuchFormGeschwisterComponent implements OnInit {
  private store = inject(Store);

  view$ = this.store.selectSignal(selectSharedDataAccessGesuchsView);

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

  editedGeschwister?: Partial<GeschwisterUpdate>;

  ngOnInit(): void {
    this.store.dispatch(SharedEventGesuchFormGeschwister.init());
  }

  public handleAddGeschwister(): void {
    this.editedGeschwister = {};
  }

  public handleSelectGeschwister(ge: GeschwisterUpdate): void {
    this.editedGeschwister = ge;
  }

  handleEditorSave(geschwister: GeschwisterUpdate) {
    const { gesuchId, trancheId, gesuchFormular } =
      this.buildUpdatedGesuchWithUpdatedGeschwister(geschwister);
    if (gesuchId && trancheId) {
      this.store.dispatch(
        SharedEventGesuchFormGeschwister.saveSubformTriggered({
          gesuchId,
          trancheId,
          gesuchFormular,
          origin: GESCHWISTER,
        })
      );
      this.editedGeschwister = undefined;
    }
  }

  public handleDeleteGeschwister(geschwister: GeschwisterUpdate) {
    const { gesuchId, trancheId, gesuchFormular } =
      this.buildUpdatedGesuchWithDeletedGeschwister(geschwister);
    if (gesuchId && trancheId) {
      this.store.dispatch(
        SharedEventGesuchFormGeschwister.saveSubformTriggered({
          gesuchId,
          trancheId,
          gesuchFormular,
          origin: GESCHWISTER,
        })
      );
      this.editedGeschwister = undefined;
    }
  }

  handleContinue() {
    const { gesuch } = this.view$();
    if (gesuch?.id) {
      this.store.dispatch(
        SharedEventGesuchFormGeschwister.nextTriggered({
          id: gesuch.id,
          origin: GESCHWISTER,
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
    const updatedGeschwisters = gesuchFormular?.geschwisters?.filter(
      (entry) => entry.id !== geschwister.id
    );

    return {
      gesuchId: gesuch?.id,
      trancheId: gesuch?.gesuchTrancheToWorkWith.id,
      gesuchFormular: {
        ...gesuchFormular,
        geschwisters: updatedGeschwisters,
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
      trancheId: gesuch?.gesuchTrancheToWorkWith.id,
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
