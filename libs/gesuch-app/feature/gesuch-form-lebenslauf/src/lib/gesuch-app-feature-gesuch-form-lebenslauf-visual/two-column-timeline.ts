import { printDateAsMonthYear } from '@dv/shared/util/validator-date';
import { addMonths, isAfter, isBefore, isEqual, subMonths } from 'date-fns';

export interface TimelineRawItem {
  id: string;
  col: 'LEFT' | 'RIGHT';
  label: string;
  dateStart: Date;
  dateEnd: Date;
  editable: boolean;
}
export interface TimelineMergedRawItem extends TimelineRawItem {
  children: TimelineRawItem[];
}

export interface TimelineAddCommand {
  dateStart: Date;
  dateEnd: Date;
}

export class TimelineBlock {
  col!: 'LEFT' | 'RIGHT' | 'BOTH';
  positionStartRow!: number;
  positionRowSpan!: number;
  dateStart!: Date;
  dateEnd!: Date;
  positionStartCol!: number;
  positionColSpan!: number;
}

export class TimelineBusyBlock extends TimelineBlock {
  id!: string;
  override col!: 'LEFT' | 'RIGHT';
  label!: string;
  editable!: boolean;

  children?: TimelineBusyBlockChild[];
}

export class TimelineBusyBlockChild {
  id!: string;
  label!: string;
  dateStart!: Date;
  dateEnd!: Date;
  editable!: boolean;
}

export class TimelineGapBlock extends TimelineBlock {
  override col!: 'BOTH';
}

export function isTimelineBusyBlock(block: TimelineBlock) {
  return block.col !== 'BOTH';
}

export function isTimelineGapBlock(block: TimelineBlock) {
  return !isTimelineBusyBlock(block);
}

export function asBusyBlock(block: TimelineBlock) {
  return block as TimelineBusyBlock;
}

export function asGapBlock(block: TimelineBlock) {
  return block as TimelineGapBlock;
}

export class TwoColumnTimeline {
  items?: (TimelineBusyBlock | TimelineGapBlock)[];
  rows!: number;
  leftCols!: number;
  rightCols!: number;

  fillWith(rawItems: TimelineRawItem[]) {
    const { items, rows, leftCols, rightCols } =
      TwoColumnTimeline.prepareItems(rawItems);
    this.items = items;
    this.rows = rows;
    this.leftCols = leftCols;
    this.rightCols = rightCols;
  }

  static prepareItems(rawItems: TimelineRawItem[]): {
    items: (TimelineBusyBlock | TimelineGapBlock)[];
    rows: number;
    leftCols: number;
    rightCols: number;
  } {
    // preparation: sort and combine overlapping blocks of same column into one with children
    const inputSorted = this.sortAndMergeRawItems(rawItems, 'MERGE');

    // setup
    const output: (TimelineBusyBlock | TimelineGapBlock)[] = [];
    const current: TimelineBusyBlock[] = [];

    let startRow = 1;
    const leftCols = 1;
    const rightCols = 1;

    const abstandHeight = 1;
    const unevenStartHeight = 1;

    // Loop
    while (inputSorted.length) {
      console.log(' *************************************** ');
      console.log(
        'sorted input: ',
        JSON.stringify(inputSorted.map((c) => c.label))
      );

      //- startDate = das erste startDate der Inputlisten (beide ersten Elemente, das frühere Datum nehmen)
      const startDate = inputSorted[0].dateStart;
      console.log('start date: ', printDateAsMonthYear(startDate));
      console.log('start row: ', startRow);

      // - aus beiden Listen alle Items mit diesem Startdatum in current-Left und current-Right schieben (als
      // busyBlocks mit rowspan=0) - alle in current mit diesem Startdatum erhalten positionStartRow=startRow
      for (const inputItem of [...inputSorted]) {
        if (isEqual(inputItem.dateStart, startDate)) {
          inputSorted.splice(inputSorted.indexOf(inputItem), 1);
          current.push({
            ...inputItem,
            positionStartRow: startRow,
            positionRowSpan: 0,
            children: inputItem.children.map(
              (rawChild) => rawChild as TimelineBusyBlockChild
            ),
          } as TimelineBusyBlock);
          console.log('moved from input to current: ', inputItem.label);
        }
      }
      console.log('current: ', JSON.stringify(current.map((c) => c.label)));

      // alle in current erhalten rowspan++ (fuer ungleiche Starts)
      if (current.length) {
        console.log('adding unevenStartHeight');
        for (const each of current) {
          each.positionRowSpan += unevenStartHeight;
        }
        startRow += unevenStartHeight;
      }

      if (current.length) {
        // endDate = das früheste Enddatum aus current
        let endDate = TwoColumnTimeline.getEarliestEnddate(current);
        console.log(
          'earliest current end date: ',
          printDateAsMonthYear(endDate)
        );
        let ealiestStartDateInInput = inputSorted.length
          ? TwoColumnTimeline.getEarliestStartdate(inputSorted)
          : undefined;
        let canMoveSomethingToOutput =
          current.length &&
          (!ealiestStartDateInInput ||
            isAfter(ealiestStartDateInInput, endDate));

        while (canMoveSomethingToOutput) {
          // - die Items aus current mit endDate=endDate bekommen gehen aus current raus in die Outputspalten
          for (const each of [...current]) {
            if (isEqual(each.dateEnd, endDate)) {
              current.splice(current.indexOf(each), 1);
              output.push(each);
              console.log(
                'moved from current to output at row: ',
                each.positionStartRow,
                each.label
              );
            }
          }

          // Abstand einfuegen, wenn das letzte Enddatum nicht direkt vorher war
          if (output.length && current.length) {
            const latestOutputEnddate = this.getLatestEnddate(output);
            const expectedNextStart = addMonths(latestOutputEnddate, 1);
            const gaplessNextBlockFound =
              inputSorted.length && isEqual(startDate, expectedNextStart);
            if (!gaplessNextBlockFound) {
              // alle in current erhalten rowspan++
              if (current.length) {
                console.log('adding abstandHeight');
                for (const each of current) {
                  each.positionRowSpan += abstandHeight;
                }
                startRow += abstandHeight;
              }
            }
          }

          // endDate = das früheste Enddatum aus current
          if (current.length) {
            endDate = TwoColumnTimeline.getEarliestEnddate(current);
            console.log(
              'earliest current end date: ',
              printDateAsMonthYear(endDate)
            );
            ealiestStartDateInInput = inputSorted.length
              ? TwoColumnTimeline.getEarliestStartdate(inputSorted)
              : undefined;
          }

          canMoveSomethingToOutput =
            current.length &&
            (!ealiestStartDateInInput ||
              isAfter(ealiestStartDateInInput, endDate));
        }
      }

      //- wenn current leer, Input nicht leer, und kein Item in Input vorhanden mit Startdatum=endDate: Gap erstellen
      // (von-bis)
      if (!current.length && inputSorted.length) {
        console.log('current is empty');
        const latestOutputEnddate = this.getLatestEnddate(output);
        const expectedNextStart = addMonths(latestOutputEnddate, 1);
        const gaplessNextBlockFound =
          inputSorted.length &&
          isEqual(inputSorted[0].dateStart, expectedNextStart);
        console.log('gap found: ', !gaplessNextBlockFound);
        if (!gaplessNextBlockFound) {
          output.push({
            col: 'BOTH',
            dateStart: expectedNextStart,
            dateEnd: subMonths(inputSorted[0].dateStart, 1),
            positionStartRow: startRow,
            positionRowSpan: 1,
          } as TimelineGapBlock);
          console.log('added gap to output');

          startRow++;
        }
      }
    }

    // Spaltenpositionen
    for (const item of output) {
      item.positionStartCol = item.col === 'RIGHT' ? leftCols + 1 : 1;
      item.positionColSpan =
        item.col === 'BOTH'
          ? leftCols + rightCols
          : item.col === 'LEFT'
          ? leftCols
          : rightCols;
    }

    // nach Startdatum sortieren: dadurch kommen die spaeteren Boxen ueber die frueheren
    output.sort((a, b) => (isBefore(a.dateStart, b.dateStart) ? -1 : 1));

    return {
      items: output,
      rows: startRow,
      leftCols: leftCols,
      rightCols: rightCols,
    };
    /*return {
      items: this.dummyItems(),
      rows: 20,
      leftCols: 1,
      rightCols: 1,
    }*/
  }

  static sortAndMergeRawItems(
    rawItems: TimelineRawItem[],
    mode: 'MERGE' | 'NO_MERGE'
  ) {
    const inputSorted = [...rawItems].sort((a, b) =>
      isBefore(a.dateStart, b.dateStart) ? -1 : 1
    );

    const output: TimelineMergedRawItem[] = [];

    if (!rawItems.length) {
      return [];
    }

    console.log('****** merging overlapping items into group ********');

    // ALGORITHM:

    while (inputSorted.length) {
      console.log('**********************************************************');

      console.log('input: ', JSON.stringify(inputSorted.map((c) => c.label)));

      // start new group: copy the next item
      const groupdStarterItem = inputSorted[0];
      inputSorted.splice(0, 1);
      const group = {
        ...groupdStarterItem,
        children: [groupdStarterItem],
      } as TimelineMergedRawItem;
      console.log('started groupd with: ', groupdStarterItem.label);

      if (mode === 'MERGE') {
        // find all input items that overlap this range
        let overlapping = this.findOverlapping(
          group.col,
          group.dateStart,
          group.dateEnd,
          inputSorted
        );
        while (overlapping.length) {
          console.log(
            'found overlapping: ',
            JSON.stringify(overlapping.map((c) => c.label))
          );

          for (const eachOverlapping of overlapping) {
            // move overlapping to group
            console.log('added child to group: ', eachOverlapping.label);
            inputSorted.splice(inputSorted.indexOf(eachOverlapping), 1);
            group.children.push(eachOverlapping);

            // adapt group date range
            group.dateStart = isBefore(
              eachOverlapping.dateStart,
              group.dateStart
            )
              ? eachOverlapping.dateStart
              : group.dateStart;
            group.dateEnd = isAfter(eachOverlapping.dateEnd, group.dateEnd)
              ? eachOverlapping.dateEnd
              : group.dateEnd;

            console.log(
              'group date range: ',
              printDateAsMonthYear(group.dateStart),
              ' ',
              printDateAsMonthYear(group.dateEnd)
            );
          }

          // search for more overlapping items
          overlapping = this.findOverlapping(
            group.col,
            group.dateStart,
            group.dateEnd,
            inputSorted
          );
        }
      }

      // move group to output
      output.push(group);

      console.log(
        'finished group: ',
        JSON.stringify(group.children.map((c) => c.label))
      );
    }

    return output;
  }

  static getEarliestEnddate(list: { dateEnd: Date }[]) {
    const listSortedByEnddate = [...list].sort((a, b) =>
      isBefore(a.dateEnd, b.dateEnd) ? -1 : 1
    );
    return listSortedByEnddate[0].dateEnd;
  }

  static getLatestEnddate(list: { dateEnd: Date }[]) {
    const listSortedByEnddate = [...list].sort((a, b) =>
      isBefore(a.dateEnd, b.dateEnd) ? 1 : -1
    );
    return listSortedByEnddate[0].dateEnd;
  }

  static getEarliestStartdate(list: { dateStart: Date }[]) {
    const listSortedByEnddate = [...list].sort((a, b) =>
      isBefore(a.dateStart, b.dateStart) ? -1 : 1
    );
    return listSortedByEnddate[0].dateStart;
  }

  static selectCol(
    col: 'LEFT' | 'RIGHT',
    output: (TimelineBusyBlock | TimelineGapBlock)[]
  ) {
    return output
      .filter((each) => each.col === col && isTimelineBusyBlock(each))
      .map((each) => asBusyBlock(each));
  }

  static findOverlapping(
    col: 'LEFT' | 'RIGHT',
    dateStart: Date,
    dateEnd: Date,
    list: TimelineRawItem[]
  ): TimelineRawItem[] {
    return list
      .filter((each) => each.col === col)
      .filter((each) => {
        const itemIsCompletelyBeforeEach = !isAfter(dateEnd, each.dateStart);
        const itemIsCompletelyAfterEach = !isAfter(each.dateEnd, dateStart);
        const itemIsNotOverlapping =
          itemIsCompletelyBeforeEach || itemIsCompletelyAfterEach;
        return !itemIsNotOverlapping;
      });
  }

  static dummyItems() {
    let leftIndex = 1;
    let rightIndex = 1;

    const items = [];

    items.push(
      // gap
      {
        col: 'BOTH',
        dateStart: new Date(2016, 1),
        dateEnd: new Date(2016, 6),
        positionStartRow: leftIndex,
        positionRowSpan: 1,
        positionStartCol: 1,
        positionColSpan: 2,
      } as TimelineGapBlock
    );
    leftIndex += 1;
    rightIndex += 1;

    items.push(
      // ausbildung
      {
        col: 'LEFT',
        positionStartRow: leftIndex,
        positionRowSpan: 3,
        positionStartCol: 1,
        positionColSpan: 1,
        children: [
          {
            id: '1',
            label: 'Informatiker EFZ',
            dateStart: new Date(2016, 7),
            dateEnd: new Date(2017, 11),
            editable: true,
          },
        ],
      } as TimelineBusyBlock
    );
    leftIndex += 6;

    items.push(
      // job
      {
        col: 'RIGHT',
        positionStartRow: rightIndex,
        positionRowSpan: 1,
        positionStartCol: 2,
        positionColSpan: 1,
        children: [
          {
            id: '2',
            label: 'Job A',
            dateStart: new Date(2016, 7),
            dateEnd: new Date(2016, 9),
            editable: true,
          },
        ],
      } as TimelineBusyBlock
    );
    rightIndex += 1;

    rightIndex += 1;
    items.push(
      // job
      {
        id: 'group',
        col: 'RIGHT',
        label: 'group',
        dateStart: new Date(2017, 7),
        dateEnd: new Date(2017, 11),
        editable: true,
        positionStartRow: rightIndex,
        positionRowSpan: 1,
        positionStartCol: 2,
        positionColSpan: 1,
        children: [
          {
            id: '2',
            col: 'RIGHT',
            label: 'Job B',
            dateStart: new Date(2017, 7),
            dateEnd: new Date(2017, 10),
            editable: true,
          },
          {
            id: '3',
            col: 'RIGHT',
            label: 'Job C',
            dateStart: new Date(2017, 8),
            dateEnd: new Date(2017, 8),
            editable: true,
          } as TimelineBusyBlock,

          {
            id: '4',
            col: 'RIGHT',
            label: 'Job D',
            dateStart: new Date(2017, 10),
            dateEnd: new Date(2017, 11),
            editable: true,
          } as TimelineBusyBlock,
        ],
      } as TimelineBusyBlock
    );
    rightIndex += 1;

    return items;
  }
}
