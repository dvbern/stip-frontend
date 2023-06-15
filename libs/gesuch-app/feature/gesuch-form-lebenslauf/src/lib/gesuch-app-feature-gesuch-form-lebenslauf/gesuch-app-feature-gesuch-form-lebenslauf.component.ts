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
import { parseMonthYearString } from '@dv/shared/util/validator-date';
import { NgbAlert } from '@ng-bootstrap/ng-bootstrap';
import { Store } from '@ngrx/store';
import { TranslateModule } from '@ngx-translate/core';
import { addYears } from 'date-fns';
import { GesuchAppFeatureGesuchFormLebenslaufEditorComponent } from '../gesuch-app-feature-gesuch-form-lebenslauf-editor/gesuch-app-feature-gesuch-form-lebenslauf-editor.component';

@Component({
  selector: 'dv-gesuch-app-feature-gesuch-form-lebenslauf',
  standalone: true,
  imports: [
    CommonModule,
    GesuchAppFeatureGesuchFormLebenslaufEditorComponent,
    GesuchAppPatternGesuchStepLayoutComponent,
    NgbAlert,
    TranslateModule,
  ],
  templateUrl: './gesuch-app-feature-gesuch-form-lebenslauf.component.html',
  styleUrls: ['./gesuch-app-feature-gesuch-form-lebenslauf.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class GesuchAppFeatureGesuchFormLebenslaufComponent implements OnInit {
  private store = inject(Store);

  view$ = this.store.selectSignal(selectGesuchAppDataAccessGesuchsView);

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
      this.view$().gesuch?.ausbildung?.ausbildungSB?.start;
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

  public handleAddAusbildung(): void {
    this.editedItem = { type: 'AUSBILDUNG' };
  }

  public handleAddTaetigkeit(): void {
    this.editedItem = { type: 'TAETIGKEIT' };
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

  public handleDeleteItem(item: LebenslaufItemDTO) {
    this.store.dispatch(
      GesuchAppEventGesuchFormLebenslauf.saveSubformTriggered({
        gesuch: this.buildUpdatedGesuchWithDeletedItem(item),
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

  private buildUpdatedGesuchWithDeletedItem(item: LebenslaufItemDTO) {
    const gesuch: Partial<SharedModelGesuch> = this.view$().gesuch!;
    const updatedItemContainers = gesuch?.lebenslaufItemContainers!.filter(
      (itemContainer) => itemContainer.lebenslaufItemSB?.id !== item.id
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
}
