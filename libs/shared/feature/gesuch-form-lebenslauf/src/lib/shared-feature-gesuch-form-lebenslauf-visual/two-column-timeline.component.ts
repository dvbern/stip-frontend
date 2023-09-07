import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  EventEmitter,
  inject,
  Input,
  OnChanges,
  Output,
  SimpleChanges,
} from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';

import {
  Ausbildung,
  Ausbildungsstaette,
  LebenslaufItem,
  LebenslaufItemUpdate,
} from '@dv/shared/model/gesuch';
import { SharedUiIconChipComponent } from '@dv/shared/ui/icon-chip';
import {
  dateFromMonthYearString,
  printDateAsMonthYear,
} from '@dv/shared/util/validator-date';

import {
  asBusyBlock,
  asGapBlock,
  isTimelineBusyBlock,
  isTimelineGapBlock,
  TimelineAddCommand,
  TimelineBusyBlock,
  TimelineBusyBlockChild,
  TimelineGapBlock,
  TimelineRawItem,
  TwoColumnTimeline,
} from './two-column-timeline';

@Component({
  selector: 'dv-shared-feature-gesuch-form-lebenslauf-visual',
  standalone: true,
  imports: [CommonModule, TranslateModule, SharedUiIconChipComponent],
  templateUrl: './two-column-timeline.component.html',
  styleUrls: ['./two-column-timeline.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TwoColumnTimelineComponent implements OnChanges {
  cd = inject(ChangeDetectorRef);

  @Output() addAusbildungTriggered = new EventEmitter<TimelineAddCommand>();
  @Output() addTaetigkeitTriggered = new EventEmitter<TimelineAddCommand>();
  @Output() editItemTriggered = new EventEmitter<string>();
  @Output() deleteItemTriggered = new EventEmitter<string>();

  @Input({ required: true }) startDate!: Date | null;
  @Input({ required: true }) lebenslaufItems!: LebenslaufItemUpdate[];
  @Input({ required: true }) ausbildung!: Ausbildung;
  @Input({ required: true }) ausbildungsstaettes?: Ausbildungsstaette[] | null;

  public ngOnChanges(changes: SimpleChanges): void {
    if (
      changes['startDate'] &&
      changes['lebenslaufItems'] &&
      changes['ausbildung'] &&
      changes['ausbildungsstaettes']
    ) {
      this.setLebenslaufItems(
        changes['startDate'].currentValue,
        changes['lebenslaufItems'].currentValue,
        changes['ausbildung'].currentValue,
        changes['ausbildungsstaettes'].currentValue
      );
    }
  }

  setLebenslaufItems(
    expectedSartDate: Date | null,
    lebenslaufItems: LebenslaufItem[],
    plannedAusbildung: Ausbildung,
    ausbildungsstaettes: Ausbildungsstaette[]
  ) {
    const timelineRawItems = lebenslaufItems.map(
      (lebenslaufItem) =>
        ({
          col: lebenslaufItem.bildungsart ? 'LEFT' : 'RIGHT',
          von: dateFromMonthYearString(lebenslaufItem.von),
          bis: dateFromMonthYearString(lebenslaufItem.bis),
          id: lebenslaufItem.id,
          label: lebenslaufItem.beschreibung,
          editable: true,
        } as TimelineRawItem)
    );

    // planned ausbildung
    const ausbildungsstaette = ausbildungsstaettes.find(
      (each) => each.id === plannedAusbildung.ausbildungsstaetteId
    );
    const ausbildungsgang = ausbildungsstaette?.ausbildungsgaenge?.find(
      (each) => each.id === plannedAusbildung.ausbildungsgangId
    );

    timelineRawItems.push({
      id: 'planned-ausbildung',
      col: 'LEFT',
      von: dateFromMonthYearString(plannedAusbildung.ausbildungBegin),
      bis: dateFromMonthYearString(plannedAusbildung.ausbildungEnd),
      label:
        ausbildungsstaette?.name +
        ': ' +
        ausbildungsgang?.bezeichnungDe +
        ' (' +
        plannedAusbildung.fachrichtung +
        ')',
      editable: false,
    } as TimelineRawItem);

    this.timeline.fillWith(expectedSartDate, timelineRawItems);
    this.cd.markForCheck();
  }

  timeline = new TwoColumnTimeline();

  trackByIndex(index: number) {
    return index;
  }

  protected readonly isTimelineBusyBlock = isTimelineBusyBlock;
  protected readonly isTimelineGapBlock = isTimelineGapBlock;
  protected readonly asBusyBlock = asBusyBlock;
  protected readonly asGapBlock = asGapBlock;

  public handleAddAusbildung(timelineBusyBlock: TimelineGapBlock): void {
    this.addAusbildungTriggered.emit({
      von: timelineBusyBlock.von,
      bis: timelineBusyBlock.bis,
    });
  }

  public handleAddTaetigkeit(timelineGapBlock: TimelineGapBlock): void {
    this.addTaetigkeitTriggered.emit({
      von: timelineGapBlock.von,
      bis: timelineGapBlock.bis,
    });
  }

  public handleEditItem(
    item: TimelineBusyBlock | TimelineBusyBlockChild
  ): void {
    this.editItemTriggered.emit(item.id);
  }

  protected readonly printDateAsMonthYear = printDateAsMonthYear;
}