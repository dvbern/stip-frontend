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
import {
  AusbildungDTO,
  AusbildungstaetteDTO,
  LebenslaufItemDTO,
} from '@dv/shared/model/gesuch';
import { SharedUiIconChipComponent } from '@dv/shared/ui/icon-chip';
import {
  dateFromMonthYearString,
  printDateAsMonthYear,
} from '@dv/shared/util/validator-date';
import { TranslateModule } from '@ngx-translate/core';
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
  selector: 'dv-gesuch-app-feature-gesuch-form-lebenslauf-visual',
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
  @Input({ required: true }) lebenslaufItems!: LebenslaufItemDTO[];
  @Input({ required: true }) ausbildung!: AusbildungDTO;
  @Input({ required: true }) ausbildungstaettes?: AusbildungstaetteDTO[] | null;

  public ngOnChanges(changes: SimpleChanges): void {
    if (
      changes['startDate'] &&
      changes['lebenslaufItems'] &&
      changes['ausbildung'] &&
      changes['ausbildungstaettes']
    ) {
      this.setLebenslaufItems(
        changes['startDate'].currentValue,
        changes['lebenslaufItems'].currentValue,
        changes['ausbildung'].currentValue,
        changes['ausbildungstaettes'].currentValue
      );
    }
  }

  setLebenslaufItems(
    expectedSartDate: Date | null,
    lebenslaufItems: LebenslaufItemDTO[],
    plannedAusbildung: AusbildungDTO,
    ausbildungstaettes: AusbildungstaetteDTO[]
  ) {
    console.log('initializing lebenslauf items for timeline');
    const timelineRawItems = lebenslaufItems.map(
      (lebenslaufItem) =>
        ({
          col: lebenslaufItem.type === 'AUSBILDUNG' ? 'LEFT' : 'RIGHT',
          dateStart: dateFromMonthYearString(lebenslaufItem.dateStart),
          dateEnd: dateFromMonthYearString(lebenslaufItem.dateEnd),
          id: lebenslaufItem.id,
          label: lebenslaufItem.name,
          editable: true,
        } as TimelineRawItem)
    );

    // planned ausbildung
    const ausbildungsstaette = ausbildungstaettes.find(
      (each) => each.id === plannedAusbildung.ausbildungstaetteId
    )!;
    const ausbildungsgang = ausbildungsstaette.ausbildungsgaenge!.find(
      (each) => each.id === plannedAusbildung.ausbildungsgangId
    );

    timelineRawItems.push({
      id: 'planned-ausbildung',
      col: 'LEFT',
      dateStart: dateFromMonthYearString(plannedAusbildung.ausbildungBegin),
      dateEnd: dateFromMonthYearString(plannedAusbildung.ausbildungEnd),
      label:
        ausbildungsstaette.name +
        ': ' +
        ausbildungsgang!.bezeichnungDe +
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
      dateStart: timelineBusyBlock.dateStart,
      dateEnd: timelineBusyBlock.dateEnd,
    });
  }

  public handleAddTaetigkeit(timelineGapBlock: TimelineGapBlock): void {
    this.addTaetigkeitTriggered.emit({
      dateStart: timelineGapBlock.dateStart,
      dateEnd: timelineGapBlock.dateEnd,
    });
  }

  public handleEditItem(
    item: TimelineBusyBlock | TimelineBusyBlockChild
  ): void {
    this.editItemTriggered.emit(item.id);
  }

  protected readonly printDateAsMonthYear = printDateAsMonthYear;
}
