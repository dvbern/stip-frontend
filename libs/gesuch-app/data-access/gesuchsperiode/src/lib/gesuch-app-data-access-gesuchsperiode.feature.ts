import { createFeature, createReducer, on } from '@ngrx/store';

import { GesuchsperiodeDTO } from '@dv/shared/model/gesuch';

import { GesuchAppDataAccessGesuchsperiodeCockpitActions } from './gesuch-app-data-access-gesuchsperiode.actions';
import { GesuchAppDataAccessGesuchsperiodeApiActions } from './gesuch-app-data-access-gesuchsperiode-api.actions';

export interface State {
  gesuchsperiodes: GesuchsperiodeDTO[];
  loading: boolean;
  error: string | undefined;
}

const initialState: State = {
  gesuchsperiodes: [],
  loading: false,
  error: undefined,
};

export const gesuchAppDataAccessGesuchsperiodesFeature = createFeature({
  name: 'gesuchsperiodes',
  reducer: createReducer(
    initialState,
    on(
      GesuchAppDataAccessGesuchsperiodeCockpitActions.init,
      (state): State => ({
        ...state,
        loading: true,
        error: undefined,
      })
    ),

    on(
      GesuchAppDataAccessGesuchsperiodeApiActions.gesuchsperiodesLoadedSuccess,
      (state, { gesuchsperiodes }): State => ({
        ...state,
        gesuchsperiodes,
        loading: false,
        error: undefined,
      })
    ),
    on(
      GesuchAppDataAccessGesuchsperiodeApiActions.gesuchsperiodesLoadedFailure,
      // add other failure actions here (if handled the same way)
      (state, { error }): State => ({
        ...state,
        gesuchsperiodes: [],
        loading: false,
        error,
      })
    )
  ),
});

export const {
  name, // feature name
  reducer,
  selectGesuchsperiodesState,
  selectGesuchsperiodes,
  selectLoading,
  selectError,
} = gesuchAppDataAccessGesuchsperiodesFeature;
