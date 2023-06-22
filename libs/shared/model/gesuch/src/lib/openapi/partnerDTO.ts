import { BackendLocalDateTS } from '../types';
import { AdresseDTO } from './adresseDTO';

export interface PartnerDTO {
  id: string;
  adresse: AdresseDTO;
  sozialversicherungsnummer: string;
  name: string;
  vorname: string;
  geburtsdatum: BackendLocalDateTS;
  jahreseinkommen: string;
}
