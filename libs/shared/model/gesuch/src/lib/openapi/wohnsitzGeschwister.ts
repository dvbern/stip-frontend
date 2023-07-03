export type WohnsitzGeschwister =
  | 'ELTERN'
  | 'MUTTER_VATER'
  | 'EIGENER_HAUSHALT';

export const WohnsitzGeschwister = {
  FAMILIE: 'FAMILIE' as WohnsitzGeschwister,
  MUTTER_VATER: 'MUTTER_VATER' as WohnsitzGeschwister,
  EIGENER_HAUSHALT: 'EIGENER_HAUSHALT' as WohnsitzGeschwister,
};
