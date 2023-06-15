import { LebenslaufItemDTO } from './lebenslaufItemDTO';

export interface LebenslaufItemContainerDTO {
  id: string;
  lebenslaufItemGS?: LebenslaufItemDTO;
  lebenslaufItemSB?: LebenslaufItemDTO;
}
