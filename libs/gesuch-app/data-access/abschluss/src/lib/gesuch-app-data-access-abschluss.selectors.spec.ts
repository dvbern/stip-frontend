import { selectGesuchAppDataAccessAbschlusssView } from './gesuch-app-data-access-abschluss.selectors';

describe('selectGesuchAppDataAccessAbschlusssView', () => {
  it('selects view', () => {
    const state = {
      gesuch: null,
      abschlussPhase: 'NOT_READY',
      loading: false,
      error: undefined,
    };
    const result = selectGesuchAppDataAccessAbschlusssView.projector(
      state,
      null
    );
    expect(result).toEqual(state);
  });
});
