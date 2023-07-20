import {
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
  OnInit,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { GesuchAppUiStepFormButtonsComponent } from '@dv/gesuch-app/ui/step-form-buttons';
import { Store } from '@ngrx/store';
import { TranslateModule } from '@ngx-translate/core';

import { GesuchAppEventGesuchFormEltern } from '@dv/gesuch-app/event/gesuch-form-eltern';
import { GesuchAppPatternGesuchStepLayoutComponent } from '@dv/gesuch-app/pattern/gesuch-step-layout';
import { ElternteilCardComponent } from './elternteil-card/elternteil-card.component';

import { selectGesuchAppFeatureGesuchFormElternView } from './gesuch-app-feature-gesuch-form-eltern.selector';
import {
  ElternTyp,
  ElternUpdate,
  GesuchFormularUpdate,
} from '@dv/shared/model/gesuch';
import { GesuchAppFeatureGesuchFormElternEditorComponent } from '../gesuch-app-feature-gesuch-form-eltern-editor/gesuch-app-feature-gesuch-form-eltern-editor.component';
import { GesuchFormSteps } from '@dv/gesuch-app/model/gesuch-form';
import { selectLanguage } from '@dv/shared/data-access/language';
import { SharedDataAccessStammdatenApiEvents } from '@dv/shared/data-access/stammdaten';

@Component({
  selector: 'dv-gesuch-app-feature-gesuch-form-eltern',
  standalone: true,
  imports: [
    CommonModule,
    TranslateModule,
    GesuchAppPatternGesuchStepLayoutComponent,
    GesuchAppFeatureGesuchFormElternEditorComponent,
    ElternteilCardComponent,
    GesuchAppUiStepFormButtonsComponent,
  ],
  templateUrl: './gesuch-app-feature-gesuch-form-eltern.component.html',
  styleUrls: ['./gesuch-app-feature-gesuch-form-eltern.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class GesuchAppFeatureGesuchFormElternComponent implements OnInit {
  private store = inject(Store);

  laenderSig = computed(() => {
    return this.view$().laender;
  });
  languageSig = this.store.selectSignal(selectLanguage);

  view$ = this.store.selectSignal(selectGesuchAppFeatureGesuchFormElternView);

  editedElternteil?: Omit<Partial<ElternUpdate>, 'elternTyp'> &
    Required<Pick<ElternUpdate, 'elternTyp'>>;

  ngOnInit(): void {
    this.store.dispatch(GesuchAppEventGesuchFormEltern.init());
    this.store.dispatch(SharedDataAccessStammdatenApiEvents.init());
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
    const { gesuchId, gesuchFormular } =
      this.buildUpdatedGesuchWithUpdatedElternteil(elternteil);
    if (gesuchId) {
      this.store.dispatch(
        GesuchAppEventGesuchFormEltern.saveSubformTriggered({
          gesuchId,
          gesuchFormular,
          origin: GesuchFormSteps.ELTERN,
        })
      );
      this.editedElternteil = undefined;
    }
  }

  public handleDeleteElternteil(id: string) {
    const { gesuchId, gesuchFormular } =
      this.buildUpdatedGesuchWithDeletedElternteil(id);
    if (gesuchId) {
      this.store.dispatch(
        GesuchAppEventGesuchFormEltern.saveSubformTriggered({
          gesuchId,
          gesuchFormular,
          origin: GesuchFormSteps.ELTERN,
        })
      );
      this.editedElternteil = undefined;
    }
  }

  handleContinue() {
    const { gesuch } = this.view$();
    if (gesuch?.id) {
      this.store.dispatch(
        GesuchAppEventGesuchFormEltern.nextTriggered({
          id: gesuch.id,
          origin: GesuchFormSteps.ELTERN,
        })
      );
    }
  }

  handleEditorClose() {
    this.editedElternteil = undefined;
  }

  private buildUpdatedGesuchWithDeletedElternteil(id: string) {
    const { gesuch, gesuchFormular } = this.view$();
    const updatedElterns = gesuchFormular?.elterns?.filter(
      (entry) => entry.id !== id
    );

    return {
      gesuchId: gesuch?.id,
      gesuchFormular: {
        ...gesuchFormular,
        elterns: updatedElterns,
      },
    };
  }

  private buildUpdatedGesuchWithUpdatedElternteil(elternteil: ElternUpdate) {
    const { gesuch, gesuchFormular } = this.view$();
    // update existing elternteil if found
    const updatedElterns =
      gesuchFormular?.elterns?.map((oldEltern) => {
        if (oldEltern.id === elternteil.id) {
          return elternteil;
        } else {
          return oldEltern;
        }
      }) ?? [];
    // add new elternteil if not found
    if (!elternteil.id) {
      updatedElterns.push(elternteil);
    }
    return {
      gesuchId: gesuch?.id,
      gesuchFormular: {
        ...gesuchFormular,
        elterns: updatedElterns,
      },
    };
  }

  protected readonly GesuchFormSteps = GesuchFormSteps;
  protected readonly ElternTyp = ElternTyp;
}

export const setupElternTeil = (
  elternTyp: ElternTyp,
  gesuchFormular?: GesuchFormularUpdate
) => {
  const adresse = gesuchFormular?.personInAusbildung?.adresse;
  const lebtbeiEltern =
    gesuchFormular?.personInAusbildung?.wohnsitz !== 'EIGENER_HAUSHALT';
  return {
    ...(adresse && lebtbeiEltern ? { adresse } : {}),
    elternTyp,
  };
};
