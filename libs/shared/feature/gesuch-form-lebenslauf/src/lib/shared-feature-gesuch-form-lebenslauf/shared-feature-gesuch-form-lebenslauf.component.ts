import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
  OnInit,
  Signal,
} from '@angular/core';
import { NgbAlert } from '@ng-bootstrap/ng-bootstrap';
import { Store } from '@ngrx/store';
import { TranslateModule } from '@ngx-translate/core';
import { addYears, setMonth, subMonths } from 'date-fns';

import { SharedEventGesuchFormLebenslauf } from '@dv/shared/event/gesuch-form-lebenslauf';
import { LEBENSLAUF } from '@dv/shared/model/gesuch-form';
import { GesuchAppUiStepFormButtonsComponent } from '@dv/shared/ui/step-form-buttons';
import { selectLanguage } from '@dv/shared/data-access/language';
import { LebenslaufItemUpdate } from '@dv/shared/model/gesuch';
import { SharedModelLebenslauf } from '@dv/shared/model/lebenslauf';
import {
  dateFromMonthYearString,
  printDateAsMonthYear,
} from '@dv/shared/util/validator-date';

import { SharedFeatureGesuchFormLebenslaufEditorComponent } from '../shared-feature-gesuch-form-lebenslauf-editor/shared-feature-gesuch-form-lebenslauf-editor.component';
import { TimelineAddCommand } from '../shared-feature-gesuch-form-lebenslauf-visual/two-column-timeline';
import { TwoColumnTimelineComponent } from '../shared-feature-gesuch-form-lebenslauf-visual/two-column-timeline.component';
import { selectSharedFeatureGesuchFormLebenslaufVew } from './shared-feature-gesuch-form-lebenslauf.selector';

const AUSBILDUNGS_MONTH = 8; // August

@Component({
  selector: 'dv-shared-feature-gesuch-form-lebenslauf',
  standalone: true,
  imports: [
    CommonModule,
    SharedFeatureGesuchFormLebenslaufEditorComponent,
    NgbAlert,
    TranslateModule,
    TwoColumnTimelineComponent,
    GesuchAppUiStepFormButtonsComponent,
  ],
  templateUrl: './shared-feature-gesuch-form-lebenslauf.component.html',
  styleUrls: ['./shared-feature-gesuch-form-lebenslauf.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SharedFeatureGesuchFormLebenslaufComponent implements OnInit {
  private store = inject(Store);
  languageSig = this.store.selectSignal(selectLanguage);

  view$ = this.store.selectSignal(selectSharedFeatureGesuchFormLebenslaufVew);

  minDate$: Signal<Date | null> = computed(() => {
    const geburtsdatum =
      this.view$().gesuchFormular?.personInAusbildung?.geburtsdatum;
    if (geburtsdatum) {
      const sixteenthBirthdate = setMonth(
        addYears(Date.parse(geburtsdatum), 16),
        AUSBILDUNGS_MONTH - 1
      );
      return new Date(
        sixteenthBirthdate.getFullYear(),
        sixteenthBirthdate.getMonth(),
        1
      );
    }
    return null;
  });

  maxDate$: Signal<Date | null> = computed(() => {
    const ausbildungStart =
      this.view$().gesuchFormular?.ausbildung?.ausbildungBegin;
    if (ausbildungStart) {
      const start = dateFromMonthYearString(ausbildungStart);
      console.log('ausbildung start parsed: ', start);
      return start ? subMonths(start, 1) : null;
    }
    return null;
  });

  ausbildungenSig: Signal<LebenslaufItemUpdate[]> = computed(() => {
    return this.view$().lebenslaufItems.filter((l) => l.bildungsart);
  });

  editedItem?: SharedModelLebenslauf;

  ngOnInit(): void {
    this.store.dispatch(SharedEventGesuchFormLebenslauf.init());
  }

  public handleAddAusbildung(addCommand: TimelineAddCommand | undefined): void {
    this.editedItem = {
      type: 'AUSBILDUNG',
      von: addCommand ? printDateAsMonthYear(addCommand.von) : undefined,
      bis: addCommand ? printDateAsMonthYear(addCommand.bis) : undefined,
    };
  }

  public handleAddTaetigkeit(addCommand: TimelineAddCommand | undefined): void {
    this.editedItem = {
      type: 'TAETIGKEIT',
      von: addCommand ? printDateAsMonthYear(addCommand.von) : undefined,
      bis: addCommand ? printDateAsMonthYear(addCommand.bis) : undefined,
    };
  }

  public handleEditItem(ge: LebenslaufItemUpdate): void {
    this.editedItem = {
      type: ge.bildungsart ? 'AUSBILDUNG' : 'TAETIGKEIT',
      ...ge,
    };
  }

  handleEditorSave(item: LebenslaufItemUpdate) {
    const { gesuchId, trancheId, gesuchFormular } =
      this.buildUpdatedGesuchWithUpdatedItem(item);
    if (gesuchId && trancheId) {
      this.store.dispatch(
        SharedEventGesuchFormLebenslauf.saveSubformTriggered({
          gesuchId,
          trancheId,
          gesuchFormular,
          origin: LEBENSLAUF,
        })
      );
      this.editedItem = undefined;
    }
  }

  public handleDeleteItem(itemId: string) {
    const { gesuchId, trancheId, gesuchFormular } =
      this.buildUpdatedGesuchWithDeletedItem(itemId);
    if (gesuchId && trancheId) {
      this.store.dispatch(
        SharedEventGesuchFormLebenslauf.saveSubformTriggered({
          gesuchId,
          trancheId,
          gesuchFormular,
          origin: LEBENSLAUF,
        })
      );
      this.editedItem = undefined;
    }
  }

  handleContinue() {
    const { gesuch } = this.view$();
    this.store.dispatch(
      SharedEventGesuchFormLebenslauf.nextTriggered({
        id: gesuch!.id!,
        origin: LEBENSLAUF,
      })
    );
  }

  handleEditorClose() {
    this.editedItem = undefined;
  }

  private buildUpdatedGesuchWithDeletedItem(itemId: string) {
    const { gesuch, gesuchFormular } = this.view$();
    const updatedItems = gesuchFormular?.lebenslaufItems?.filter(
      (item) => item.id !== itemId
    );

    return {
      gesuchId: gesuch?.id,
      trancheId: gesuch?.gesuchTrancheToWorkWith.id,
      gesuchFormular: {
        ...gesuchFormular,
        lebenslaufItems: updatedItems,
      },
    };
  }

  private buildUpdatedGesuchWithUpdatedItem(item: LebenslaufItemUpdate) {
    const { gesuch, gesuchFormular } = this.view$();
    // update existing item if found
    const updatedItems =
      gesuchFormular?.lebenslaufItems?.map((oldItem) => {
        if (item.id === oldItem.id) {
          return item;
        } else {
          return oldItem;
        }
      }) ?? [];
    // add new item if not found
    if (!item.id) {
      updatedItems.push(item);
    }
    return {
      gesuchId: gesuch?.id,
      trancheId: gesuch?.gesuchTrancheToWorkWith.id,
      gesuchFormular: {
        ...gesuchFormular,
        lebenslaufItems: updatedItems,
      },
    };
  }

  trackByIndex(index: number) {
    return index;
  }

  public asItem(itemRaw: LebenslaufItemUpdate): LebenslaufItemUpdate {
    return itemRaw;
  }

  public handleEditItemId(id: string, items: LebenslaufItemUpdate[]): void {
    const item = items.find((each) => each.id === id);
    if (item) {
      this.handleEditItem(item);
    }
  }

  protected readonly printDateAsMonthYear = printDateAsMonthYear;
}
