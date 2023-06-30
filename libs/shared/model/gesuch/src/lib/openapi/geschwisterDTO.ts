import { BackendLocalDateTS } from '../types';
import { Wohnsitz } from './wohnsitz';

export interface GeschwisterDTO {
  id: string;
  name: string;
  vorname: string;
  geburtsdatum: BackendLocalDateTS;
  wohnsitz: Wohnsitz;
  wohnsitzAnteilMutter?: number;
  wohnsitzAnteilVater?: number;
  ausbildungssituation: string;
}
