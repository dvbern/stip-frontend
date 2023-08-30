import { selectSharedDataAccessBenutzersView } from './shared-data-access-benutzer.selectors';

describe('selectSharedDataAccessBenutzersView', () => {
  it('selects view', () => {
    const state = {
      currentBenutzer: null,
      loading: false,
      error: undefined,
    };
    const result = selectSharedDataAccessBenutzersView.projector(state);
    expect(result).toEqual(state);
  });
});
