import { createFeature, createReducer, on } from '@ngrx/store';

import { SharedModelGesuch } from '@dv/shared/model/gesuch';

import {
  GesuchAppDataAccessGesuchCockpitActions,
  GesuchAppDataAccessGesuchFormActions,
} from './gesuch-app-data-access-gesuch.actions';
import { GesuchAppDataAccessGesuchApiActions } from './gesuch-app-data-access-gesuch-api.actions';

export interface State {
  gesuch: SharedModelGesuch | undefined;
  gesuchs: SharedModelGesuch[];
  loading: boolean;
  error: string | undefined;
}

const initialState: State = {
  gesuch: undefined,
  gesuchs: [],
  loading: false,
  error: undefined,
};

export const gesuchAppDataAccessGesuchsFeature = createFeature({
  name: 'gesuchs',
  reducer: createReducer(
    initialState,

    on(
      GesuchAppDataAccessGesuchCockpitActions.init,
      GesuchAppDataAccessGesuchCockpitActions.removeTriggered,
      GesuchAppDataAccessGesuchFormActions.init,
      GesuchAppDataAccessGesuchFormActions.nextStepTriggered,
      (state): State => ({
        ...state,
        gesuch: undefined,
        loading: true,
      })
    ),

    on(
      GesuchAppDataAccessGesuchApiActions.gesuchsLoadedSuccess,
      (state, { gesuchs }): State => ({
        ...state,
        gesuchs,
        loading: false,
        error: undefined,
      })
    ),

    on(
      GesuchAppDataAccessGesuchApiActions.gesuchLoadedSuccess,
      (state, { gesuch }): State => ({
        ...state,
        gesuch,
        loading: false,
        error: undefined,
      })
    ),

    on(
      GesuchAppDataAccessGesuchApiActions.gesuchUpdatedSuccess,
      GesuchAppDataAccessGesuchApiActions.gesuchRemovedSuccess,
      (state): State => ({
        ...state,
        loading: false,
        error: undefined,
      })
    ),

    on(
      GesuchAppDataAccessGesuchApiActions.gesuchsLoadedFailure,
      GesuchAppDataAccessGesuchApiActions.gesuchLoadedFailure,
      GesuchAppDataAccessGesuchApiActions.gesuchCreatedFailure,
      GesuchAppDataAccessGesuchApiActions.gesuchUpdatedFailure,
      GesuchAppDataAccessGesuchApiActions.gesuchRemovedFailure,
      // add other failure actions here (if handled the same way)
      (state, { error }): State => ({
        ...state,
        loading: false,
        error,
      })
    )
  ),
});

export const {
  name, // feature name
  reducer,
  selectGesuchsState,
  selectGesuch,
  selectGesuchs,
  selectLoading,
  selectError,
} = gesuchAppDataAccessGesuchsFeature;
