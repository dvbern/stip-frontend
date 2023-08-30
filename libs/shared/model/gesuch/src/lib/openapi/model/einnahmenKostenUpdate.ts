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

export interface EinnahmenKostenUpdate { 
    nettoerwerbseinkommen: number;
    /**
     * Required nur wenn mind. ein Elternteil Alimente zahlt
     */
    alimente?: number;
    /**
     * Required nur wenn die Person Kinder hat
     */
    zulagen?: number;
    /**
     * Required nur wenn mind. ein Elternteil gestorben ist
     */
    renten?: number;
    eoLeistungen?: number;
    ergaenzungsleistungen?: number;
    beitraege?: number;
    /**
     * Required nur wenn die ausgewählte Ausbildung auf der Sekundarstuffe II ist
     */
    ausbildungskostenSekundarstufeZwei?: number;
    /**
     * Required nur wenn die ausgewählte Ausbildung auf der Tertiärstufe ist
     */
    ausbildungskostenTertiaerstufe?: number;
    fahrkosten: number;
    wohnkosten: number;
    personenImHaushalt: number;
    verdienstRealisiert: boolean;
    /**
     * Required nur wenn volljährig
     */
    willDarlehen?: boolean;
}

