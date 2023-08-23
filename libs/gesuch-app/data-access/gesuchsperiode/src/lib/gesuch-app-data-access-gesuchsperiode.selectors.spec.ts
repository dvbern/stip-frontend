import { selectGesuchAppDataAccessGesuchsperiodesView } from './gesuch-app-data-access-gesuchsperiode.selectors';

describe('selectGesuchAppDataAccessGesuchsperiodesView', () => {
  it('selects view', () => {
    const state = {
      gesuchsperiodes: [],
      loading: false,
      error: undefined,
    };
    const result =
      selectGesuchAppDataAccessGesuchsperiodesView.projector(state);
    expect(result).toEqual(state);
  });
});
