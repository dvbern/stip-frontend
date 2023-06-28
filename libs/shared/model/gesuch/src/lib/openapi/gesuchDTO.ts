/**
 * STIP Service API
 * No description provided (generated by Openapi Generator https://github.com/openapitools/openapi-generator)
 *
 * The version of the OpenAPI document: 1.0
 *
 *
 * NOTE: This class is auto generated by OpenAPI Generator (https://openapi-generator.tech).
 * https://openapi-generator.tech
 * Do not edit the class manually.
 */
import { GesuchsperiodeDTO } from './gesuchsperiodeDTO';
import { PersonInAusbildungContainerDTO } from './personInAusbildungContainerDTO';
import { Gesuchstatus } from './gesuchstatus';
import { FallDTO } from './fallDTO';
import { FamiliensituationContainerDTO } from './familiensituationContainerDTO';
import { AusbildungContainerDTO } from './ausbildungContainerDTO';
import { PartnerContainerDTO } from './partnerContainerDTO';
import { GeschwisterContainerDTO } from './geschwisterContainerDTO';
import { LebenslaufItemContainerDTO } from './lebenslaufItemContainerDTO';
import { ElternContainerDTO } from './elternContainerDTO';
import { AuszahlungContainerDTO } from './auszahlungContainerDTO';

export interface GesuchDTO {
  id?: string;
  fall: FallDTO;
  gesuchsperiode: GesuchsperiodeDTO;
  personInAusbildungContainer?: PersonInAusbildungContainerDTO;
  ausbildungContainer?: AusbildungContainerDTO;
  familiensituationContainer?: FamiliensituationContainerDTO;
  gesuchStatus: Gesuchstatus;
  gesuchNummer: number;
  partnerContainer: PartnerContainerDTO;
  geschwisterContainers: GeschwisterContainerDTO[];
  lebenslaufItemContainers: LebenslaufItemContainerDTO[];
  auszahlungContainer?: AuszahlungContainerDTO;
  elternContainers: ElternContainerDTO[];
}
