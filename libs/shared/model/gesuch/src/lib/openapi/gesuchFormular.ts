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
import { Eltern } from './eltern';
import { PersonInAusbildung } from './personInAusbildung';
import { Ausbildung } from './ausbildung';
import { Geschwister } from './geschwister';
import { Kind } from './kind';
import { Familiensituation } from './familiensituation';
import { Auszahlung } from './auszahlung';
import { Partner } from './partner';
import { LebenslaufItem } from './lebenslaufItem';

export interface GesuchFormular { 
    ausbildung?: Ausbildung;
    personInAusbildung?: PersonInAusbildung;
    familiensituation?: Familiensituation;
    partner?: Partner;
    auszahlung?: Auszahlung;
    /**
     * 
     */
    elterns?: Array<Eltern>;
    /**
     * 
     */
    geschwisters?: Array<Geschwister>;
    /**
     * 
     */
    lebenslaufItems?: Array<LebenslaufItem>;
    /**
     * 
     */
    kinds?: Array<Kind>;
}

