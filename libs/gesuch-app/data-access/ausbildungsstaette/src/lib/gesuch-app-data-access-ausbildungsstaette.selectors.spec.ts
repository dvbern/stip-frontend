import { selectGesuchAppDataAccessAusbildungsstaettesView } from './gesuch-app-data-access-ausbildungsstaette.selectors';

describe('selectGesuchAppDataAccessAusbildungsstaettesView', () => {
  it('selects view', () => {
    const state = {
      ausbildungsstaettes: [],
      loading: false,
      error: undefined,
    };
    const result =
      selectGesuchAppDataAccessAusbildungsstaettesView.projector(state);
    expect(result).toEqual(state);
  });
});
