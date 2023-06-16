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
import { AusbildungDTO, LebenslaufItemDTO } from '@dv/shared/model/gesuch';
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

  @Input({ required: true })
  lebenslaufItems!: LebenslaufItemDTO[];

  @Input({ required: true })
  ausbildung!: AusbildungDTO;

  public ngOnChanges(changes: SimpleChanges): void {
    if (changes['lebenslaufItems'] && changes['ausbildung']) {
      this.setLebenslaufItems(
        changes['lebenslaufItems'].currentValue,
        changes['ausbildung'].currentValue
      );
    }
  }

  setLebenslaufItems(
    lebenslaufItems: LebenslaufItemDTO[],
    plannedAusbildung: AusbildungDTO
  ) {
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

    timelineRawItems.push({
      id: 'planned-ausbildung',
      col: 'LEFT',
      dateStart: dateFromMonthYearString(plannedAusbildung.start),
      dateEnd: dateFromMonthYearString(plannedAusbildung.ende),
      label:
        plannedAusbildung.ausbildungsstaette +
        ': ' +
        plannedAusbildung.ausbildungsgang +
        ' (' +
        plannedAusbildung.fachrichtung +
        ')',
      editable: false,
    } as TimelineRawItem);

    this.timeline.fillWith(timelineRawItems);
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

  public handleEditItem(item: TimelineBusyBlock): void {
    this.editItemTriggered.emit(item.id);
  }

  public handleDeleteItem(item: TimelineBusyBlock): void {
    this.deleteItemTriggered.emit(item.id);
  }

  protected readonly printDateAsMonthYear = printDateAsMonthYear;
}
