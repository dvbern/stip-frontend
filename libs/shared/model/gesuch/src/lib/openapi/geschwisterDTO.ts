import { Wohnsitz } from './wohnsitz';

export interface GeschwisterDTO {
  id: string;
  name: string;
  vorname: string;
  geburtsdatum: string;
  wohnsitz: Wohnsitz;
  ausbildungssituation: string;
}
