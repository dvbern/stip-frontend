import { TestBed } from '@angular/core/testing';

import { sharedUtilIsValidTelefonNummer } from './shared-util-validator-telefon-nummer';

describe('sharedUtilIsValidAhv', () => {
  it('valid CH Telefonnummer', () => {
    expect(sharedUtilIsValidTelefonNummer('+41 26 660 60 60')).toBe(true);
  });
  it('invalid CH Telefonnummer', () => {
    expect(sharedUtilIsValidTelefonNummer('+41 26 660 60')).toBe(false);
  });
  it('valid Ausland Telefonnummer', () => {
    expect(sharedUtilIsValidTelefonNummer('+352 33 33')).toBe(true);
  });
  it('invalid Ausland in CH Telefonnummer', () => {
    expect(sharedUtilIsValidTelefonNummer('+41 33 33')).toBe(false);
  });
});
