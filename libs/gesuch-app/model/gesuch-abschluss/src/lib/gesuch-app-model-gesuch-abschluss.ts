import { SharedModelGesuch } from '@dv/shared/model/gesuch';

export type AbschlussPhase = 'NOT_READY' | 'READY_TO_SEND' | 'SUBMITTED';
export const toAbschlussPhase = (
  gesuch: SharedModelGesuch | null,
  isComplete: boolean
): AbschlussPhase => {
  if (!gesuch) {
    return 'NOT_READY';
  }
  switch (gesuch.gesuchStatus) {
    case 'OFFEN':
      return isComplete ? 'READY_TO_SEND' : 'NOT_READY';
    default:
      return 'SUBMITTED';
  }
};
