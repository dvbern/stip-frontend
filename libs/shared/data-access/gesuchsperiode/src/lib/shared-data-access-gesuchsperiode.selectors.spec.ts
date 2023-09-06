import { selectSharedDataAccessGesuchsperiodesView } from './shared-data-access-gesuchsperiode.selectors';

describe('selectSharedDataAccessGesuchsperiodesView', () => {
  it('selects view', () => {
    const state = {
      gesuchsperiodes: [],
      loading: false,
      error: undefined,
    };
    const result = selectSharedDataAccessGesuchsperiodesView.projector(state);
    expect(result).toEqual(state);
  });
});
