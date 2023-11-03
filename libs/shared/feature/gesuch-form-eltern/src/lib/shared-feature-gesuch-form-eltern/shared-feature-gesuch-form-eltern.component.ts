import {
  ChangeDetectionStrategy,
  Component,
  computed,
  effect,
  inject,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { GesuchAppUiStepFormButtonsComponent } from '@dv/shared/ui/step-form-buttons';
import { Store } from '@ngrx/store';
import { TranslateModule } from '@ngx-translate/core';

import {
  ElternTyp,
  ElternUpdate,
  GesuchFormularUpdate,
} from '@dv/shared/model/gesuch';
import { SharedEventGesuchFormEltern } from '@dv/shared/event/gesuch-form-eltern';
import { ELTERN, isStepDisabled } from '@dv/shared/model/gesuch-form';
import { selectLanguage } from '@dv/shared/data-access/language';
import { SharedDataAccessStammdatenApiEvents } from '@dv/shared/data-access/stammdaten';
import { capitalized } from '@dv/shared/util-fn/string-helper';

import { ElternteilCardComponent } from './elternteil-card/elternteil-card.component';
import { selectSharedFeatureGesuchFormElternView } from './shared-feature-gesuch-form-eltern.selector';
import { SharedFeatureGesuchFormElternEditorComponent } from '../shared-feature-gesuch-form-eltern-editor/shared-feature-gesuch-form-eltern-editor.component';

@Component({
  selector: 'dv-shared-feature-gesuch-form-eltern',
  standalone: true,
  imports: [
    CommonModule,
    TranslateModule,
    SharedFeatureGesuchFormElternEditorComponent,
    ElternteilCardComponent,
    GesuchAppUiStepFormButtonsComponent,
  ],
  templateUrl: './shared-feature-gesuch-form-eltern.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SharedFeatureGesuchFormElternComponent {
  private store = inject(Store);

  laenderSig = computed(() => {
    return this.view$().laender;
  });
  languageSig = this.store.selectSignal(selectLanguage);

  view$ = this.store.selectSignal(selectSharedFeatureGesuchFormElternView);

  editedElternteil?: Omit<Partial<ElternUpdate>, 'elternTyp'> &
    Required<Pick<ElternUpdate, 'elternTyp'>>;

  constructor() {
    this.store.dispatch(SharedEventGesuchFormEltern.init());
    this.store.dispatch(SharedDataAccessStammdatenApiEvents.init());
    effect(
      () => {
        const { loading, gesuch, gesuchFormular } = this.view$();
        if (
          !loading &&
          gesuch &&
          gesuchFormular &&
          isStepDisabled(ELTERN, gesuchFormular)
        ) {
          this.store.dispatch(
            SharedEventGesuchFormEltern.nextTriggered({
              id: gesuch?.id,
              origin: ELTERN,
            })
          );
        }
      },
      { allowSignalWrites: true }
    );
  }

  trackByIndex(index: number) {
    return index;
  }

  handleEdit(elternteil: ElternUpdate) {
    this.editedElternteil = elternteil;
  }

  handleAddElternteil(elternTyp: ElternTyp) {
    const { gesuchFormular } = this.view$();
    this.editedElternteil = setupElternTeil(elternTyp, gesuchFormular);
  }

  handleEditorSave(elternteil: ElternUpdate) {
    const { gesuchId, trancheId, gesuchFormular } =
      this.buildUpdatedGesuchWithUpdatedElternteil(elternteil);
    if (gesuchId && trancheId) {
      this.store.dispatch(
        SharedEventGesuchFormEltern.saveSubformTriggered({
          gesuchId,
          trancheId,
          gesuchFormular,
          origin: ELTERN,
        })
      );
      this.editedElternteil = undefined;
    }
  }

  public handleDeleteElternteil(id: string) {
    const { gesuchId, trancheId, gesuchFormular } =
      this.buildUpdatedGesuchWithDeletedElternteil(id);
    if (gesuchId && trancheId) {
      this.store.dispatch(
        SharedEventGesuchFormEltern.saveSubformTriggered({
          gesuchId,
          trancheId,
          gesuchFormular,
          origin: ELTERN,
        })
      );
      this.editedElternteil = undefined;
    }
  }

  handleContinue() {
    const { gesuch } = this.view$();
    if (gesuch?.id) {
      this.store.dispatch(
        SharedEventGesuchFormEltern.nextTriggered({
          id: gesuch.id,
          origin: ELTERN,
        })
      );
    }
  }

  handleEditorClose() {
    this.editedElternteil = undefined;
  }

  private buildUpdatedGesuchWithDeletedElternteil(id: string) {
    const { gesuch, gesuchFormular, expectMutter, expectVater } = this.view$();
    const updatedElterns = gesuchFormular?.elterns?.filter(
      (entry) =>
        entry.id !== id &&
        isElternTypeExpected(entry, { expectMutter, expectVater })
    );

    return {
      gesuchId: gesuch?.id,
      trancheId: gesuch?.gesuchTrancheToWorkWith.id,
      gesuchFormular: {
        ...gesuchFormular,
        elterns: updatedElterns,
      },
    };
  }

  private buildUpdatedGesuchWithUpdatedElternteil(elternteil: ElternUpdate) {
    const { gesuch, gesuchFormular, expectMutter, expectVater } = this.view$();
    // update existing elternteil if found
    const updatedElterns =
      gesuchFormular?.elterns
        ?.map((oldEltern) => {
          if (oldEltern.id === elternteil.id) {
            return elternteil;
          } else {
            return oldEltern;
          }
        })
        .filter((entry) =>
          isElternTypeExpected(entry, { expectMutter, expectVater })
        ) ?? [];
    // add new elternteil if not found
    if (!elternteil.id) {
      updatedElterns.push(elternteil);
    }
    return {
      gesuchId: gesuch?.id,
      trancheId: gesuch?.gesuchTrancheToWorkWith.id,
      gesuchFormular: {
        ...gesuchFormular,
        elterns: updatedElterns,
      },
    };
  }

  protected readonly ElternTyp = ElternTyp;
}

export const setupElternTeil = (
  elternTyp: ElternTyp,
  gesuchFormular: GesuchFormularUpdate | null
) => {
  const adresse = gesuchFormular?.personInAusbildung?.adresse;
  const lebtBeiEltern =
    gesuchFormular?.personInAusbildung?.wohnsitz === 'FAMILIE';
  return {
    ...(adresse && lebtBeiEltern
      ? { adresse: { ...adresse, id: undefined } }
      : {}),
    elternTyp,
  };
};

const isElternTypeExpected = (
  eltern: ElternUpdate,
  expected: { expectVater: boolean; expectMutter: boolean }
) => {
  return expected[`expect${capitalized(eltern.elternTyp)}`];
};
