import { selectGesuchAppDataAccessAusbildungstaettesView } from './gesuch-app-data-access-ausbildungstaette.selectors';

describe('selectGesuchAppDataAccessAusbildungstaettesView', () => {
  it('selects view', () => {
    const state = {
      ausbildungstaettes: [],
      loading: false,
      error: null,
    };
    const result =
      selectGesuchAppDataAccessAusbildungstaettesView.projector(state);
    expect(result).toEqual(state);
  });
});
