import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
  OnInit,
  Signal,
} from '@angular/core';
import { selectGesuchAppDataAccessGesuchsView } from '@dv/gesuch-app/data-access/gesuch';
import { GesuchAppEventGesuchFormLebenslauf } from '@dv/gesuch-app/event/gesuch-form-lebenslauf';
import { GesuchFormSteps } from '@dv/gesuch-app/model/gesuch-form';
import { GesuchAppPatternGesuchStepLayoutComponent } from '@dv/gesuch-app/pattern/gesuch-step-layout';
import { LebenslaufItemDTO, SharedModelGesuch } from '@dv/shared/model/gesuch';
import {
  parseMonthYearString,
  printDateAsMonthYear,
} from '@dv/shared/util/validator-date';
import { NgbAlert } from '@ng-bootstrap/ng-bootstrap';
import { Store } from '@ngrx/store';
import { TranslateModule } from '@ngx-translate/core';
import { addYears } from 'date-fns';
import { GesuchAppFeatureGesuchFormLebenslaufEditorComponent } from '../gesuch-app-feature-gesuch-form-lebenslauf-editor/gesuch-app-feature-gesuch-form-lebenslauf-editor.component';
import { TimelineAddCommand } from '../gesuch-app-feature-gesuch-form-lebenslauf-visual/two-column-timeline';
import { TwoColumnTimelineComponent } from '../gesuch-app-feature-gesuch-form-lebenslauf-visual/two-column-timeline.component';

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
  ],
  templateUrl: './gesuch-app-feature-gesuch-form-lebenslauf.component.html',
  styleUrls: ['./gesuch-app-feature-gesuch-form-lebenslauf.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class GesuchAppFeatureGesuchFormLebenslaufComponent implements OnInit {
  private store = inject(Store);

  view$ = this.store.selectSignal(selectGesuchAppDataAccessGesuchsView);

  ausbildung$ = computed(() => {
    return this.view$().gesuch?.ausbildungContainer?.ausbildungSB;
  });

  lebenslaufItems$: Signal<LebenslaufItemDTO[]> = computed(() => {
    console.log(
      'lebenslauf items: ',
      this.view$().gesuch?.lebenslaufItemContainers
    );
    if (!this.view$().gesuch?.lebenslaufItemContainers) {
      return [];
    }

    return (
      this.view$()
        .gesuch?.lebenslaufItemContainers.map((each) => each.lebenslaufItemSB)
        .filter((each) => each?.id) as LebenslaufItemDTO[]
    ).sort((a, b) => {
      const monthYearA = parseMonthYearString(a.dateStart!);
      const monthYearB = parseMonthYearString(b.dateStart!);

      if (monthYearB.year !== monthYearA.year) {
        return monthYearA.year - monthYearB.year;
      }
      return monthYearA.month - monthYearB.month;
    });
  });

  minDate$: Signal<Date | null> = computed(() => {
    const geburtsdatum =
      this.view$().gesuch?.personInAusbildungContainer?.personInAusbildungSB
        ?.geburtsdatum;
    if (geburtsdatum) {
      const sixteenthBirthdate = addYears(Date.parse(geburtsdatum), 16);
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
      this.view$().gesuch?.ausbildungContainer?.ausbildungSB?.ausbildungBegin;
    if (ausbildungStart) {
      const start = parseMonthYearString(ausbildungStart);
      return new Date(start.year, start.month - 1, 1);
    }
    return null;
  });

  protected readonly GesuchFormSteps = GesuchFormSteps;

  editedItem?: Partial<LebenslaufItemDTO>;

  ngOnInit(): void {
    this.store.dispatch(GesuchAppEventGesuchFormLebenslauf.init());
  }

  public handleAddAusbildung(addCommand: TimelineAddCommand | undefined): void {
    this.editedItem = {
      type: 'AUSBILDUNG',
      dateStart: addCommand
        ? printDateAsMonthYear(addCommand.dateStart)
        : undefined,
      dateEnd: addCommand
        ? printDateAsMonthYear(addCommand.dateEnd)
        : undefined,
    };
  }

  public handleAddTaetigkeit(addCommand: TimelineAddCommand | undefined): void {
    this.editedItem = {
      type: 'TAETIGKEIT',
      dateStart: addCommand
        ? printDateAsMonthYear(addCommand.dateStart)
        : undefined,
      dateEnd: addCommand
        ? printDateAsMonthYear(addCommand.dateEnd)
        : undefined,
    };
  }

  public handleEditItem(ge: LebenslaufItemDTO): void {
    this.editedItem = ge;
  }

  handleEditorSave(item: LebenslaufItemDTO) {
    this.store.dispatch(
      GesuchAppEventGesuchFormLebenslauf.saveSubformTriggered({
        gesuch: this.buildUpdatedGesuchWithUpdatedItem(item),
        origin: GesuchFormSteps.LEBENSLAUF,
      })
    );
    this.editedItem = undefined;
  }

  public handleDeleteItem(itemId: string) {
    this.store.dispatch(
      GesuchAppEventGesuchFormLebenslauf.saveSubformTriggered({
        gesuch: this.buildUpdatedGesuchWithDeletedItem(itemId),
        origin: GesuchFormSteps.LEBENSLAUF,
      })
    );
    this.editedItem = undefined;
  }

  handleEditorAutoSave(item: LebenslaufItemDTO) {
    console.log('TODO save item on blur', item);
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
    const gesuch: Partial<SharedModelGesuch> = this.view$().gesuch!;
    const updatedItemContainers = gesuch?.lebenslaufItemContainers!.filter(
      (itemContainer) => itemContainer.lebenslaufItemSB?.id !== itemId
    );

    return {
      ...gesuch,
      lebenslaufItemContainers: updatedItemContainers,
    };
  }

  private buildUpdatedGesuchWithUpdatedItem(item: LebenslaufItemDTO) {
    const gesuch: Partial<SharedModelGesuch> = this.view$().gesuch!;
    // update existing item if found
    const updatedItemContainers =
      gesuch?.lebenslaufItemContainers?.map((itemContainer) => {
        if (itemContainer.lebenslaufItemSB?.id === item.id) {
          return {
            ...itemContainer,
            lebenslaufItemSB: item,
          };
        } else {
          return itemContainer;
        }
      }) ?? [];
    // add new item if not found
    if (!item.id) {
      // TODO new item doesnt have ID, will be added by backend?
      updatedItemContainers.push({
        lebenslaufItemSB: {
          ...item,
          id: 'generated by backend? or FE uuid?' + item.name,
        },
        id: 'generated by backend? or FE uuid?' + item.name,
      });
    }
    return {
      ...gesuch,
      lebenslaufItemContainers: updatedItemContainers,
    };
  }

  trackByIndex(index: number) {
    return index;
  }

  public asItem(itemRaw: LebenslaufItemDTO): LebenslaufItemDTO {
    return itemRaw;
  }

  public handleEditItemId(id: string, items: LebenslaufItemDTO[]): void {
    const item = items.find((each) => each.id === id);
    if (item) {
      this.handleEditItem(item);
    }
  }

  protected readonly printDateAsMonthYear = printDateAsMonthYear;
}
