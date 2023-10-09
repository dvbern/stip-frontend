import {
  TimelineBusyBlock,
  TimelineGapBlock,
  TimelineRawItem,
  TwoColumnTimeline,
} from './two-column-timeline';

describe('TwoColumnTimeline', () => {
  const testItems = {
    EFZ: {
      id: '11',
      col: 'LEFT',
      label: { title: 'Informatiker EFZ' },
      von: new Date(2016, 7),
      bis: new Date(2017, 11),
      editable: true,
    } as TimelineRawItem,
    JobA: {
      id: '12',
      col: 'RIGHT',
      label: { title: 'Job A' },
      von: new Date(2016, 7),
      bis: new Date(2016, 9),
      editable: true,
    } as TimelineRawItem,
    JobB: {
      id: '13',
      col: 'RIGHT',
      label: { title: 'Job B' },
      von: new Date(2017, 7),
      bis: new Date(2017, 10),
      editable: true,
    } as TimelineRawItem,
    JobC: {
      id: '14',
      col: 'RIGHT',
      label: { title: 'Job C' },
      von: new Date(2017, 8),
      bis: new Date(2017, 8),
      editable: true,
    } as TimelineRawItem,
    JobD: {
      id: '15',
      col: 'RIGHT',
      label: { title: 'Job D' },
      von: new Date(2017, 10),
      bis: new Date(2017, 11),
      editable: true,
    } as TimelineRawItem,
  };
  const dummyItems = createDummyItems();

  beforeEach(() => {
    jest.spyOn(console, 'log').mockImplementation(() => {
      // do nothing
    });
  });

  it('should fillWith correctly on empy', () => {
    const result = new TwoColumnTimeline();
    result.fillWith(new Date(2016, 1), []);
    expect(result.leftCols).toEqual(1);
    expect(result.rightCols).toEqual(1);
  });

  it('should fillWith correctly like dummyItems', () => {
    const result = new TwoColumnTimeline();
    result.fillWith(new Date(2016, 1), [
      testItems.EFZ,
      testItems.JobA,
      testItems.JobB,
      testItems.JobC,
      testItems.JobD,
    ]);
    expect(result.items).toStrictEqual(dummyItems);
  });

  function createDummyItems() {
    let leftIndex = 1;
    let rightIndex = 1;

    const items = [];

    items.push(
      // gap
      {
        col: 'BOTH',
        von: new Date(2016, 1),
        bis: new Date(2016, 6),
        positionStartRow: leftIndex,
        positionRowSpan: 1,
        positionStartCol: 1,
        positionColSpan: 2,
      } as TimelineGapBlock
    );
    leftIndex += 1;
    rightIndex += 1;

    items.push(
      // job
      {
        col: 'RIGHT',
        label: { title: 'Job A' },
        von: testItems.JobA.von,
        bis: testItems.JobA.bis,
        editable: true,
        id: '12',
        positionStartRow: rightIndex,
        positionRowSpan: 1,
        positionStartCol: 2,
        positionColSpan: 1,
        children: [testItems.JobA],
      } as TimelineBusyBlock
    );
    rightIndex += 1;

    items.push(
      // ausbildung
      {
        col: 'LEFT',
        label: { title: 'Informatiker EFZ' },
        von: testItems.EFZ.von,
        bis: testItems.EFZ.bis,
        editable: true,
        id: '11',
        positionStartRow: leftIndex,
        positionRowSpan: 5,
        positionStartCol: 1,
        positionColSpan: 1,
        children: [testItems.EFZ],
      } as TimelineBusyBlock
    );
    rightIndex += 1;

    items.push(
      // job
      {
        col: 'RIGHT',
        label: { title: 'Job B' },
        von: testItems.JobB.von,
        bis: testItems.JobB.bis,
        editable: true,
        id: '13',
        positionStartRow: rightIndex,
        positionRowSpan: 2,
        positionStartCol: 2,
        positionColSpan: 1,
        children: [testItems.JobB, testItems.JobC],
      } as TimelineBusyBlock
    );
    rightIndex += 1;

    items.push(
      // job
      {
        col: 'RIGHT',
        label: { title: 'Job D' },
        von: testItems.JobD.von,
        bis: testItems.JobD.bis,
        editable: true,
        id: '15',
        positionStartRow: rightIndex,
        positionRowSpan: 2,
        positionStartCol: 2,
        positionColSpan: 1,
        children: [testItems.JobD],
      } as TimelineBusyBlock
    );

    return items;
  }
});
