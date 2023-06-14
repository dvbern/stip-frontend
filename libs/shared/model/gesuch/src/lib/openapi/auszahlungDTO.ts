import { AdresseDTO } from './adresseDTO';
import { KontoinhaberinType } from './KontoinhaberinType';

export interface AuszahlungDTO {
  id?: string;
  kontoinhaberin?: KontoinhaberinType;
  name?: string;
  vorname?: string;
  adresse?: AdresseDTO;
  iban?: string;
}
