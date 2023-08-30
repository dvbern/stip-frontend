import { selectSharedDataAccessConfigsView } from './shared-data-access-config.selectors';

describe('selectSharedDataAccessConfigsView', () => {
  it('selects view', () => {
    const state = {
      deploymentConfig: undefined,
      loading: false,
      error: undefined,
    };
    const result = selectSharedDataAccessConfigsView.projector(state);
    expect(result).toEqual(state);
  });
});
