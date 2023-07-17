import { selectGesuchAppDataAccessAusbildungsstaettesView } from './gesuch-app-data-access-ausbildungsstaette.selectors';

describe('selectGesuchAppDataAccessAusbildungsstaettesView', () => {
  it('selects view', () => {
    const state = {
      ausbildungsstaettes: [],
      loading: false,
      error: null,
    };
    const result =
      selectGesuchAppDataAccessAusbildungsstaettesView.projector(state);
    expect(result).toEqual(state);
  });
});
