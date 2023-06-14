export type KontoinhaberinType =
  | 'GESUCHSTELLERIN'
  | 'VATER'
  | 'MUTTER'
  | 'SOZIALDIENST_INSTITUTION'
  | 'ANDERE';

export const KontoinhaberinType = {
  GESUCHSTELLERIN: 'GESUCHSTELLERIN' as KontoinhaberinType,
  VATER: 'VATER' as KontoinhaberinType,
  MUTTER: 'MUTTER' as KontoinhaberinType,
  SOZIALDIENST_INSTITUTION: 'SOZIALDIENST_INSTITUTION' as KontoinhaberinType,
  ANDERE: 'ANDERE' as KontoinhaberinType,
};
