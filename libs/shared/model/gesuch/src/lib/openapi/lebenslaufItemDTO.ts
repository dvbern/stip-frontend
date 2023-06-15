import { Bildungsart } from './bildungsart';
import { Taetigskeitsart } from './taetigskeitsart';

export interface LebenslaufItemDTO {
  id: string;
  type: 'AUSBILDUNG' | 'TAETIGKEIT';
  subtype: Bildungsart | Taetigskeitsart;
  name: string;
  dateStart: string;
  dateEnd: string;
  wohnsitz: string;
}
