import { LebenslaufItemUpdate } from '@dv/shared/model/gesuch';

export type SharedModelLebenslauf = Partial<LebenslaufItemUpdate> & {
  type: 'AUSBILDUNG' | 'TAETIGKEIT';
};
