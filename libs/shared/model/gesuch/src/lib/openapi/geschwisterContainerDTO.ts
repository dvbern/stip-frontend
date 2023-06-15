import { GeschwisterDTO } from './geschwisterDTO';

export interface GeschwisterContainerDTO {
  id: string;
  geschwisterGS?: GeschwisterDTO;
  geschwisterSB?: GeschwisterDTO;
}
