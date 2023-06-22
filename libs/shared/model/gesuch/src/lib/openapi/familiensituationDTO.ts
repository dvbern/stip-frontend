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
import { ElternAbwesenheitsGrund } from './elternAbwesenheitsGrund';
import { Elternschaftsteilung } from './elternschaftsteilung';
import { ElternUnbekanntheitsGrund } from './elternUnbekanntheitsGrund';

export interface FamiliensituationDTO {
  id: string;
  elternVerheiratetZusammen?: boolean;
  elternteilVerstorben?: boolean;
  elternteilUnbekanntVerstorben?: boolean;
  gerichtlicheAlimentenregelung?: boolean;
  mutterUnbekanntVerstorben?: ElternAbwesenheitsGrund;
  mutterUnbekanntGrund?: ElternUnbekanntheitsGrund;
  mutterWiederverheiratet?: boolean;
  obhut?: Elternschaftsteilung;
  obhutMutter?: number;
  obhutVater?: number;
  sorgerecht?: Elternschaftsteilung;
  sorgerechtMutter?: number;
  sorgerechtVater?: number;
  vaterUnbekanntVerstorben?: ElternAbwesenheitsGrund;
  vaterUnbekanntGrund?: ElternUnbekanntheitsGrund;
  vaterWiederverheiratet?: boolean;
  werZahltAlimente?: Elternschaftsteilung;
}
