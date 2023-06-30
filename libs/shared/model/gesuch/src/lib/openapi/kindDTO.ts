import { BackendLocalDateTS } from '../types';
import { Wohnsitz } from './wohnsitz';

export interface KindDTO {
  id: string;
  name: string;
  vorname: string;
  geburtsdatum: BackendLocalDateTS;
  wohnsitz: Wohnsitz;
  ausbildungssituation: string;
}
