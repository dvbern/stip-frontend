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
import { TranslateModule, TranslateService } from '@ngx-translate/core';

import {
  Ausbildung,
  Ausbildungsgang,
  Ausbildungsstaette,
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
  translate = inject(TranslateService);

  @Output() addAusbildungTriggered = new EventEmitter<TimelineAddCommand>();
  @Output() addTaetigkeitTriggered = new EventEmitter<TimelineAddCommand>();
  @Output() editItemTriggered = new EventEmitter<string>();
  @Output() deleteItemTriggered = new EventEmitter<string>();

  @Input({ required: true }) startDate!: Date | null;
  @Input({ required: true }) lebenslaufItems!: LebenslaufItemUpdate[];
  @Input({ required: true }) ausbildung!: Ausbildung;
  @Input({ required: true }) ausbildungsstaettes!: Ausbildungsstaette[];
  @Input({ required: true }) language!: string;

  public ngOnChanges(changes: SimpleChanges): void {
    if (
      (changes['startDate'] &&
        changes['lebenslaufItems'] &&
        changes['ausbildung'] &&
        changes['ausbildungsstaettes']) ||
      changes['language']
    ) {
      this.setLebenslaufItems(
        this.startDate,
        this.lebenslaufItems,
        this.ausbildung,
        this.ausbildungsstaettes
      );
    }
  }

  setLebenslaufItems(
    expectedSartDate: Date | null,
    lebenslaufItems: LebenslaufItemUpdate[],
    plannedAusbildung: Ausbildung | undefined,
    ausbildungsstaettes: Ausbildungsstaette[]
  ) {
    const timelineRawItems = lebenslaufItems.map(
      (lebenslaufItem) =>
        ({
          col: lebenslaufItem.bildungsart ? 'LEFT' : 'RIGHT',
          von: dateFromMonthYearString(lebenslaufItem.von),
          bis: dateFromMonthYearString(lebenslaufItem.bis),
          id: lebenslaufItem.id,
          label: this.getLebenslaufItemLabel(lebenslaufItem),
          editable: true,
        } as TimelineRawItem)
    );

    // planned ausbildung
    const ausbildungsstaette = ausbildungsstaettes.find((staette) =>
      staette.ausbildungsgaenge?.some(
        (ausbildungsgang) =>
          plannedAusbildung?.ausbildungsgangId === ausbildungsgang.id
      )
    );
    const ausbildungsgang = ausbildungsstaette?.ausbildungsgaenge?.find(
      (each) => each.id === plannedAusbildung?.ausbildungsgangId
    );

    timelineRawItems.push({
      id: 'planned-ausbildung',
      col: 'LEFT',
      von: dateFromMonthYearString(plannedAusbildung?.ausbildungBegin),
      bis: dateFromMonthYearString(plannedAusbildung?.ausbildungEnd),
      label: {
        title:
          (this.getTranslatedAusbildungstaetteName(ausbildungsstaette) ??
            plannedAusbildung?.alternativeAusbildungsstaette) +
          ': ' +
          (this.getTranslatedAusbildungsgangBezeichung(ausbildungsgang) ??
            plannedAusbildung?.alternativeAusbildungsgang),
        subTitle: {
          key: 'shared.form.lebenslauf.item.name.fachrichtung',
          value: plannedAusbildung?.fachrichtung,
        },
      },
      editable: false,
    } as TimelineRawItem);

    this.timeline.fillWith(expectedSartDate, timelineRawItems);
    this.cd.markForCheck();
  }

  private getLebenslaufItemLabel(
    lebenslaufItem: LebenslaufItemUpdate
  ): TimelineRawItem['label'] {
    if (
      lebenslaufItem.taetigskeitsart !== undefined &&
      lebenslaufItem.taetigskeitsart !== null
    ) {
      return { title: lebenslaufItem.taetigkeitsBeschreibung || '' };
    }
    if (
      lebenslaufItem.bildungsart === 'EIDGENOESSISCHES_BERUFSATTEST' ||
      lebenslaufItem.bildungsart === 'EIDGENOESSISCHES_FAEHIGKEITSZEUGNIS'
    ) {
      return {
        title: `shared.form.lebenslauf.item.subtype.bildungsart.${lebenslaufItem.bildungsart}`,
        subTitle: {
          key: 'shared.form.lebenslauf.item.name.berufsbezeichnung',
          value: lebenslaufItem.berufsbezeichnung,
        },
      };
    }
    if (
      lebenslaufItem.bildungsart === 'BACHELOR_HOCHSCHULE_UNI' ||
      lebenslaufItem.bildungsart === 'BACHELOR_FACHHOCHSCHULE' ||
      lebenslaufItem.bildungsart === 'MASTER'
    ) {
      return {
        title: `shared.form.lebenslauf.item.subtype.bildungsart.${lebenslaufItem.bildungsart}`,
        subTitle: {
          key: 'shared.form.lebenslauf.item.name.fachrichtung',
          value: lebenslaufItem.fachrichtung,
        },
      };
    }
    return {
      title:
        lebenslaufItem.bildungsart === 'ANDERER_BILDUNGSABSCHLUSS'
          ? lebenslaufItem.titelDesAbschlusses || ''
          : `shared.form.lebenslauf.item.subtype.bildungsart.${lebenslaufItem.bildungsart}`,
    };
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

  private getTranslatedAusbildungstaetteName(
    staette: Ausbildungsstaette | undefined
  ): string | undefined {
    if (staette === undefined) {
      return undefined;
    }
    return this.language === 'fr' ? staette.nameFr : staette.nameDe;
  }

  protected readonly printDateAsMonthYear = printDateAsMonthYear;

  private getTranslatedAusbildungsgangBezeichung(
    ausbildungsgang: Ausbildungsgang | undefined
  ): string | undefined {
    if (ausbildungsgang === undefined) {
      return undefined;
    }
    return this.language === 'fr'
      ? ausbildungsgang.bezeichnungFr
      : ausbildungsgang.bezeichnungDe;
  }
}
