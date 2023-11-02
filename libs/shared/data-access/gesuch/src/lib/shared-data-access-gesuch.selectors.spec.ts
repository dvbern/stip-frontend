import { State } from './shared-data-access-gesuch.feature';
import { selectSharedDataAccessGesuchsView } from './shared-data-access-gesuch.selectors';

describe('selectSharedDataAccessGesuchsView', () => {
  it('selects view', () => {
    const state: State = {
      gesuch: null,
      gesuchs: [],
      gesuchFormular: null,
      loading: false,
      error: undefined,
    };
    const result = selectSharedDataAccessGesuchsView.projector(state);
    expect(result.loading).toBeFalsy();
  });
});
