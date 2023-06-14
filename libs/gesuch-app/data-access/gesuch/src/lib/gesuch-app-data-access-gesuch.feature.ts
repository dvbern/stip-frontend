import { GesuchAppEventGesuchFormEducation } from '@dv/gesuch-app/event/gesuch-form-education';
import { GesuchAppEventGesuchFormFamiliensituation } from '@dv/gesuch-app/event/gesuch-form-familiensituation';
import { createFeature, createReducer, on } from '@ngrx/store';

import { SharedModelGesuch } from '@dv/shared/model/gesuch';
import { GesuchAppEventCockpit } from '@dv/gesuch-app/event/cockpit';

import { GesuchAppDataAccessGesuchEvents } from './gesuch-app-data-access-gesuch.events';
import { GesuchAppEventGesuchFormPerson } from '@dv/gesuch-app/event/gesuch-form-person';
import { GesuchAppEventGesuchFormEltern } from '@dv/gesuch-app/event/gesuch-form-eltern';

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
      GesuchAppEventCockpit.init,
      (state): State => ({
        ...state,
        gesuchs: [],
      })
    ),

    on(
      GesuchAppEventCockpit.init,
      GesuchAppEventGesuchFormPerson.init,
      GesuchAppEventGesuchFormEducation.init,
      GesuchAppEventGesuchFormFamiliensituation.init,
      GesuchAppEventGesuchFormEltern.init,
      GesuchAppEventGesuchFormPerson.saveTriggered,
      GesuchAppEventGesuchFormEducation.saveTriggered,
      GesuchAppEventGesuchFormFamiliensituation.saveTriggered,
      GesuchAppEventGesuchFormEltern.saveTriggered,
      GesuchAppEventGesuchFormEltern.saveSubformTriggered,
      GesuchAppEventCockpit.removeTriggered,
      (state): State => ({
        ...state,
        gesuch: undefined,
        loading: true,
      })
    ),

    on(
      GesuchAppDataAccessGesuchEvents.gesuchsLoadedSuccess,
      (state, { gesuchs }): State => ({
        ...state,
        gesuchs,
        loading: false,
        error: undefined,
      })
    ),

    on(
      GesuchAppDataAccessGesuchEvents.gesuchLoadedSuccess,
      (state, { gesuch }): State => ({
        ...state,
        gesuch,
        loading: false,
        error: undefined,
      })
    ),

    on(
      GesuchAppDataAccessGesuchEvents.gesuchUpdatedSuccess,
      GesuchAppDataAccessGesuchEvents.gesuchRemovedSuccess,
      GesuchAppDataAccessGesuchEvents.gesuchUpdatedSubformSuccess,
      (state): State => ({
        ...state,
        loading: false,
        error: undefined,
      })
    ),

    on(
      GesuchAppDataAccessGesuchEvents.gesuchsLoadedFailure,
      GesuchAppDataAccessGesuchEvents.gesuchLoadedFailure,
      GesuchAppDataAccessGesuchEvents.gesuchCreatedFailure,
      GesuchAppDataAccessGesuchEvents.gesuchUpdatedFailure,
      GesuchAppDataAccessGesuchEvents.gesuchUpdatedSubformFailure,
      GesuchAppDataAccessGesuchEvents.gesuchRemovedFailure,
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
