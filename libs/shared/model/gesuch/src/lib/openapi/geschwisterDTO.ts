import { BackendLocalDateTS } from '../types';
import { WohnsitzGeschwister } from './wohnsitzGeschwister';

export interface GeschwisterDTO {
  id: string;
  name: string;
  vorname: string;
  geburtsdatum: BackendLocalDateTS;
  wohnsitz: WohnsitzGeschwister;
  wohnsitzAnteilMutter?: number;
  wohnsitzAnteilVater?: number;
  ausbildungssituation: string;
}
