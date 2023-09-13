import { Gesuchstatus, SharedModelGesuch } from '@dv/shared/model/gesuch';

type HandledStates = Extract<Gesuchstatus, 'IN_BEARBEITUNG' | 'EINGEREICHT'>;
type GesuchstatusMap<T> = { [K in HandledStates]: T };
const STATUS_ICON_MAP: GesuchstatusMap<string> = {
  IN_BEARBEITUNG: 'edit',
  EINGEREICHT: 'check_box',
};

function toHandledState(gesuchstatus: Gesuchstatus): HandledStates {
  switch (gesuchstatus) {
    case 'EINGEREICHT':
      return gesuchstatus;
    default:
      return 'IN_BEARBEITUNG';
  }
}

export type GesuchByStatus = {
  status: Gesuchstatus;
  iconName: string;
  count: number;
};
export function countByStatus(gesuche: SharedModelGesuch[]): GesuchByStatus[] {
  const gesucheByStatus = gesuche.reduce<GesuchstatusMap<number>>(
    (acc, g) => ({
      ...acc,
      [toHandledState(g.gesuchStatus)]:
        (acc[toHandledState(g.gesuchStatus)] ?? 0) + 1,
    }),
    {} as GesuchstatusMap<number>
  );
  return (Object.keys(STATUS_ICON_MAP) as HandledStates[]).reduce(
    (acc, status) => [
      ...acc,
      {
        status,
        iconName: STATUS_ICON_MAP[status],
        count: gesucheByStatus[status] ?? 0,
      },
    ],
    [] as GesuchByStatus[]
  );
}
