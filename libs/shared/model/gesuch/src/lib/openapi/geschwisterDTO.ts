import { WohnsitzGeschwister } from './wohnsitzGeschwister';

export interface GeschwisterDTO {
  id: string;
  name: string;
  vorname: string;
  geburtsdatum: string;
  wohnsitz: WohnsitzGeschwister;
  wohnsitzAnteilMutter?: number;
  wohnsitzAnteilVater?: number;
  ausbildungssituation: string;
}
