import { BackendLocalDateTS } from '../types';
import { WohnsitzGeschwister } from './wohnsitzGeschwister';

export interface KindDTO {
  id: string;
  name: string;
  vorname: string;
  geburtsdatum: BackendLocalDateTS;
  wohnsitz: WohnsitzGeschwister;
  ausbildungssituation: string;
}
