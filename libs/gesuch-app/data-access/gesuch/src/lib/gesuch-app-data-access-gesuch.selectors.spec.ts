import { State } from './gesuch-app-data-access-gesuch.feature';
import { selectGesuchAppDataAccessGesuchsView } from './gesuch-app-data-access-gesuch.selectors';

describe('selectGesuchAppDataAccessGesuchsView', () => {
  it('selects view', () => {
    const state: State = {
      gesuch: null,
      gesuchs: [],
      gesuchFormular: null,
      loading: false,
      error: undefined,
    };
    const result = selectGesuchAppDataAccessGesuchsView.projector(state);
    expect(result.gesuchFormStepsInfo.length).toBeTruthy();
  });
});
