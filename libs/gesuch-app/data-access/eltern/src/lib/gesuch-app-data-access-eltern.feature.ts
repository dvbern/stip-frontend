import { createFeature, createReducer, on } from '@ngrx/store';

import { GesuchAppDataAccessElternApiEvents } from './gesuch-app-data-access-eltern.events';
import { ElternContainerDTO } from '@dv/shared/model/gesuch';
import {
  GesuchAppEventGesuchFormMutter,
  GesuchAppEventGesuchFormVater,
} from '@dv/gesuch-app/event/gesuch-form-eltern';

export interface State {
  elternContainer: ElternContainerDTO | undefined;
  loading: boolean;
  error: string | undefined;
}

const initialState: State = {
  elternContainer: undefined,
  loading: false,
  error: undefined,
};

export const gesuchAppDataAccessElternsFeature = createFeature({
  name: 'elterns',
  reducer: createReducer(
    initialState,

    on(
      GesuchAppEventGesuchFormVater.init,
      GesuchAppEventGesuchFormMutter.init,
      (state): State => ({
        ...state,
        elternContainer: undefined,
        loading: true,
        error: undefined,
      })
    ),

    on(
      GesuchAppDataAccessElternApiEvents.elternsLoadedSuccess,
      (state, { elternContainer }): State => ({
        ...state,
        elternContainer,
        loading: false,
        error: undefined,
      })
    ),
    on(
      GesuchAppDataAccessElternApiEvents.elternsLoadedFailure,
      // add other failure events here (if handled the same way)
      (state, { error }): State => ({
        ...state,
        elternContainer: undefined,
        loading: false,
        error,
      })
    )
  ),
});

export const {
  name, // feature name
  reducer,
  selectElternsState,
  selectLoading,
  selectError,
} = gesuchAppDataAccessElternsFeature;
