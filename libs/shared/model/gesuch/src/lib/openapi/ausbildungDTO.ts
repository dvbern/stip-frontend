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
import { AusbildungsPensum } from './ausbildungsPensum';
import { Ausbildungsland } from './ausbildungsland';

export interface AusbildungDTO {
  id: string;
  ausbildungsgangId: string;
  ausbildungstaetteId: string;
  ausbildungsland: Ausbildungsland;
  alternativeAusbildungsgang?: string;
  alternativeAusbildungstaette?: string;
  fachrichtung: string;
  ausbildungNichtGefunden: boolean;
  ausbildungBegin: string;
  ausbildungEnd: string;
  pensum: AusbildungsPensum;
}
