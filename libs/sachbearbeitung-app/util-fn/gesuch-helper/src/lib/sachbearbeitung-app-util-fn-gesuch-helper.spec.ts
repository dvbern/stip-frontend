import { countByStatus } from './sachbearbeitung-app-util-fn-gesuch-helper';

describe('sachbearbeitungAppUtilFnGesuchHelper', () => {
  it.each([
    [
      'have 1 Eingereicht',
      [{ gesuchStatus: 'EINGEREICHT' }],
      [
        { status: 'IN_BEARBEITUNG', count: 0, iconName: 'edit' },
        { status: 'EINGEREICHT', count: 1, iconName: 'check_box' },
      ],
    ],
    [
      'have 1 Eingereicht and 1 In Bearbeitung',
      [{ gesuchStatus: 'EINGEREICHT' }, { gesuchStatus: 'IN_BEARBEITUNG' }],
      [
        { status: 'IN_BEARBEITUNG', count: 1, iconName: 'edit' },
        { status: 'EINGEREICHT', count: 1, iconName: 'check_box' },
      ],
    ],
    [
      'have 1 Eingereicht and 4 In Bearbeitung',
      [
        { gesuchStatus: 'EINGEREICHT' },
        { gesuchStatus: 'OFFEN' },
        { gesuchStatus: 'IN_BEARBEITUNG' },
        { gesuchStatus: 'NICHT_KOMPLETT_EINGEREICHT' },
        { gesuchStatus: 'NICHT_KOMPLETT_EINGEREICHT_NACHFRIST' },
      ],
      [
        { status: 'IN_BEARBEITUNG', count: 4, iconName: 'edit' },
        { status: 'EINGEREICHT', count: 1, iconName: 'check_box' },
      ],
    ],
  ] as const)('countByStatus should work %s', (_, list, expected) => {
    expect(countByStatus(list as any)).toEqual(expected);
  });
});
