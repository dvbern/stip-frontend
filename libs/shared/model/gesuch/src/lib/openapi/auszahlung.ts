/**
 * STIP API
 * No description provided (generated by Openapi Generator https://github.com/openapitools/openapi-generator)
 *
 * The version of the OpenAPI document: 1.0
 * 
 *
 * NOTE: This class is auto generated by OpenAPI Generator (https://openapi-generator.tech).
 * https://openapi-generator.tech
 * Do not edit the class manually.
 */
import { Adresse } from './adresse';
import { Kontoinhaber } from './kontoinhaber';

/**
 * 
 */
export interface Auszahlung { 
    vorname: string;
    adresse: Adresse;
    iban: string;
    nachname: string;
    kontoinhaber: Kontoinhaber;
}



