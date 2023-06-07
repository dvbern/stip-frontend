import { selectGesuchAppDataAccessAusbildungsgangsView } from './gesuch-app-data-access-ausbildungsgang.selectors';

describe('selectGesuchAppDataAccessAusbildungsgangsView', () => {
  it('selects view', () => {
    const state = {
      ausbildungsgangLands: [],
      loading: false,
      error: null,
    };
    const result =
      selectGesuchAppDataAccessAusbildungsgangsView.projector(state);
    expect(result).toEqual(state);
  });
});
