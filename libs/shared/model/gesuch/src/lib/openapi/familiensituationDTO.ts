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
import {ElternAbwesenheitsGrund} from './elternAbwesenheitsGrund';
import {Elternschaftsteilung} from './elternschaftsteilung';
import {ElternUnbekanntheitsGrund} from './elternUnbekanntheitsGrund';

export interface FamiliensituationDTO {
  id: string;
  leiblicheElternVerheiratetKonkubinat: boolean;
  elternteilVerstorben: boolean;
  elternteilVerstorbenUnbekannt: boolean;
  gerichtlicheAlimentenregelung: boolean;
  mutterUnbekanntVerstorben: ElternAbwesenheitsGrund;
  mutterUnbekanntReason: ElternUnbekanntheitsGrund;
  mutterWiederverheiratet: boolean;
  obhut: Elternschaftsteilung;
  obhutMutter: number;
  obhutVater: number;
  sorgerecht: Elternschaftsteilung;
  vaterUnbekanntVerstorben: ElternAbwesenheitsGrund;
  vaterUnbekanntReason: ElternUnbekanntheitsGrund;
  vaterWiederverheiratet: boolean;
  werZahltAlimente: Elternschaftsteilung;
}
