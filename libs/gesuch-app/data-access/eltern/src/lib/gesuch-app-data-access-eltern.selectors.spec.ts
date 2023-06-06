import { selectGesuchAppDataAccessElternsView } from './gesuch-app-data-access-eltern.selectors';

describe('selectGesuchAppDataAccessElternsView', () => {
  it('selects view', () => {
    const state = {
      elterns: [],
      loading: false,
      error: null,
    };
    const result = selectGesuchAppDataAccessElternsView.projector(state);
    expect(result).toEqual(state);
  });
});