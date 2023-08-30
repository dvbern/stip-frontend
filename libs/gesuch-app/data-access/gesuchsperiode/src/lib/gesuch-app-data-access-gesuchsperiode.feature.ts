import { createFeature, createReducer, on } from '@ngrx/store';

import { SharedModelError } from '@dv/shared/model/error';
import { Gesuchsperiode } from '@dv/shared/model/gesuch';
import { GesuchAppEventCockpit } from '@dv/gesuch-app/event/cockpit';

import { GesuchAppDataAccessGesuchsperiodeEvents } from './gesuch-app-data-access-gesuchsperiode.events';

export interface State {
  gesuchsperiodes: Gesuchsperiode[];
  loading: boolean;
  error: SharedModelError | undefined;
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
      GesuchAppEventCockpit.init,
      (state): State => ({
        ...state,
        loading: true,
        error: undefined,
      })
    ),

    on(
      GesuchAppDataAccessGesuchsperiodeEvents.gesuchsperiodesLoadedSuccess,
      (state, { gesuchsperiodes }): State => ({
        ...state,
        gesuchsperiodes,
        loading: false,
        error: undefined,
      })
    ),
    on(
      GesuchAppDataAccessGesuchsperiodeEvents.gesuchsperiodesLoadedFailure,
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
