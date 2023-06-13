import { PartnerDTO } from './partnerDTO';

export interface PartnerContainerDTO {
  id: string;
  partnerGS?: PartnerDTO;
  partnerSB?: PartnerDTO;
}
