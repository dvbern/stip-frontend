import { AuszahlungDTO } from './auszahlungDTO';

export interface AuszahlungContainerDTO {
  id?: string;
  auszahlungGS?: AuszahlungDTO;
  auszahlungSB?: AuszahlungDTO;
}
