import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
  OnInit,
  Signal,
} from '@angular/core';
import { GesuchAppEventGesuchFormLebenslauf } from '@dv/gesuch-app/event/gesuch-form-lebenslauf';
import { GesuchFormSteps } from '@dv/gesuch-app/model/gesuch-form';
import { GesuchAppPatternGesuchStepLayoutComponent } from '@dv/gesuch-app/pattern/gesuch-step-layout';
import { GesuchAppUiStepFormButtonsComponent } from '@dv/gesuch-app/ui/step-form-buttons';
import { selectLanguage } from '@dv/shared/data-access/language';
import { LebenslaufItemUpdate } from '@dv/shared/model/gesuch';
import { SharedModelLebenslauf } from '@dv/shared/model/lebenslauf';
import {
  dateFromMonthYearString,
  printDateAsMonthYear,
} from '@dv/shared/util/validator-date';
import { NgbAlert } from '@ng-bootstrap/ng-bootstrap';
import { Store } from '@ngrx/store';
import { TranslateModule } from '@ngx-translate/core';
import { addYears, setMonth, subMonths } from 'date-fns';
import { GesuchAppFeatureGesuchFormLebenslaufEditorComponent } from '../gesuch-app-feature-gesuch-form-lebenslauf-editor/gesuch-app-feature-gesuch-form-lebenslauf-editor.component';
import { TimelineAddCommand } from '../gesuch-app-feature-gesuch-form-lebenslauf-visual/two-column-timeline';
import { TwoColumnTimelineComponent } from '../gesuch-app-feature-gesuch-form-lebenslauf-visual/two-column-timeline.component';
import { selectGesuchAppFeatureGesuchFormLebenslaufVew } from './gesuch-app-feature-gesuch-form-lebenslauf.selector';

const AUSBILDUNGS_MONTH = 8; // August

@Component({
  selector: 'dv-gesuch-app-feature-gesuch-form-lebenslauf',
  standalone: true,
  imports: [
    CommonModule,
    GesuchAppFeatureGesuchFormLebenslaufEditorComponent,
    GesuchAppPatternGesuchStepLayoutComponent,
    NgbAlert,
    TranslateModule,
    TwoColumnTimelineComponent,
    GesuchAppUiStepFormButtonsComponent,
  ],
  templateUrl: './gesuch-app-feature-gesuch-form-lebenslauf.component.html',
  styleUrls: ['./gesuch-app-feature-gesuch-form-lebenslauf.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class GesuchAppFeatureGesuchFormLebenslaufComponent implements OnInit {
  private store = inject(Store);
  languageSig = this.store.selectSignal(selectLanguage);

  view$ = this.store.selectSignal(
    selectGesuchAppFeatureGesuchFormLebenslaufVew
  );

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

  protected readonly GesuchFormSteps = GesuchFormSteps;

  editedItem?: SharedModelLebenslauf;

  ngOnInit(): void {
    this.store.dispatch(GesuchAppEventGesuchFormLebenslauf.init());
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
    const { gesuchId, gesuchFormular } =
      this.buildUpdatedGesuchWithUpdatedItem(item);
    if (gesuchId) {
      this.store.dispatch(
        GesuchAppEventGesuchFormLebenslauf.saveSubformTriggered({
          gesuchId,
          gesuchFormular,
          origin: GesuchFormSteps.LEBENSLAUF,
        })
      );
      this.editedItem = undefined;
    }
  }

  public handleDeleteItem(itemId: string) {
    const { gesuchId, gesuchFormular } =
      this.buildUpdatedGesuchWithDeletedItem(itemId);
    if (gesuchId) {
      this.store.dispatch(
        GesuchAppEventGesuchFormLebenslauf.saveSubformTriggered({
          gesuchId,
          gesuchFormular,
          origin: GesuchFormSteps.LEBENSLAUF,
        })
      );
      this.editedItem = undefined;
    }
  }

  handleContinue() {
    const { gesuch } = this.view$();
    this.store.dispatch(
      GesuchAppEventGesuchFormLebenslauf.nextTriggered({
        id: gesuch!.id!,
        origin: GesuchFormSteps.LEBENSLAUF,
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
      gesuchFormular: {
        ...gesuch,
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
