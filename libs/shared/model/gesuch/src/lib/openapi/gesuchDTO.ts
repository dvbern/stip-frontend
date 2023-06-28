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

export interface GesuchDTO {
  id?: string;
  fall: FallDTO;
  gesuchsperiode: GesuchsperiodeDTO;
  personInAusbildungContainer?: PersonInAusbildungContainerDTO;
  ausbildungContainer?: AusbildungContainerDTO;
  familiensituationContainer?: FamiliensituationContainerDTO;
  gesuchStatus: Gesuchstatus;
  gesuchNummer: number;
}
