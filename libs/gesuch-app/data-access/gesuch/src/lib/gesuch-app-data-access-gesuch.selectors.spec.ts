import { selectGesuchAppDataAccessGesuchsView } from './gesuch-app-data-access-gesuch.selectors';

describe('selectGesuchAppDataAccessGesuchsView', () => {
  it('selects view', () => {
    const state = {
      gesuch: undefined,
      gesuchs: [],
      loading: false,
      error: null,
    };
    const result = selectGesuchAppDataAccessGesuchsView.projector(state);
    expect(result).toEqual({ ...state, formStepMax: 12 });
  });
});
