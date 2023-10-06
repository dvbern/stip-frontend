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
import { WohnsitzKanton } from './wohnsitzKanton';
import { LebenslaufAusbildungsArt } from './lebenslaufAusbildungsArt';
import { Taetigskeitsart } from './taetigskeitsart';

/**
 *
 */
export interface LebenslaufItem {
    copyOfId?: string;
    id: string;
    bildungsart?: LebenslaufAusbildungsArt;
    /**
     * Datum im Format mm.YYYY
     */
    von: string;
    /**
     * Datum im Format mm.YYYY
     */
    bis: string;
    wohnsitz: WohnsitzKanton;
    /**
     *
     */
    ausbildungAbgeschlossen?: boolean;
    /**
     * Requierd wenn bildungsart = \'EIDGENOESSISCHES_BERUFSATTEST\' oder \'EIDGENOESSISCHES_FAEHIGKEITSZEUGNIS\'
     */
    berufsbezeichnung?: string;
    /**
     * Required wenn bildungsart = \"BACHELOR_HOCHSCHULE_UNI\" oder \"BACHELOR_FACHHOCHSCHULE\" oder \"MASTER\"
     */
    fachrichtung?: string;
    /**
     * Required wenn bildungsart = \"ANDERER_AUSBILDUNGSABSCHLUSS\"
     */
    titelDesAbschlusses?: string;
    taetigskeitsart?: Taetigskeitsart;
    /**
     * Required wenn taetigkeitsart != null
     */
    taetigkeitsBeschreibung?: string;
}



