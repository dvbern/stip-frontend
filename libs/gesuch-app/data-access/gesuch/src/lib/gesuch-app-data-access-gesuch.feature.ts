import { GesuchAppEventGesuchFormKinder } from '@dv/gesuch-app/event/gesuch-form-kinder';
import { createFeature, createReducer, on } from '@ngrx/store';

import { SharedModelError } from '@dv/shared/model/error';
import { SharedModelGesuch } from '@dv/shared/model/gesuch';
import { GesuchAppEventCockpit } from '@dv/gesuch-app/event/cockpit';
import { GesuchAppEventGesuchFormEducation } from '@dv/gesuch-app/event/gesuch-form-education';
import { GesuchAppEventGesuchFormGeschwister } from '@dv/gesuch-app/event/gesuch-form-geschwister';
import { GesuchAppEventGesuchFormLebenslauf } from '@dv/gesuch-app/event/gesuch-form-lebenslauf';
import { GesuchAppEventGesuchFormFamiliensituation } from '@dv/gesuch-app/event/gesuch-form-familiensituation';

import { GesuchAppDataAccessGesuchEvents } from './gesuch-app-data-access-gesuch.events';
import { GesuchAppEventGesuchFormPerson } from '@dv/gesuch-app/event/gesuch-form-person';
import { GesuchAppEventGesuchFormEltern } from '@dv/gesuch-app/event/gesuch-form-eltern';

export interface State {
  gesuch: SharedModelGesuch | undefined;
  gesuchs: SharedModelGesuch[];
  loading: boolean;
  error: SharedModelError | undefined;
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
      GesuchAppEventGesuchFormGeschwister.init,
      GesuchAppEventGesuchFormKinder.init,
      GesuchAppEventGesuchFormLebenslauf.init,
      (state): State => ({
        ...state,
        gesuch: undefined,
        loading: true,
      })
    ),

    on(
      GesuchAppEventGesuchFormPerson.saveTriggered,
      GesuchAppEventGesuchFormEducation.saveTriggered,
      GesuchAppEventGesuchFormFamiliensituation.saveTriggered,
      GesuchAppEventGesuchFormEltern.saveTriggered,
      GesuchAppEventGesuchFormEltern.saveSubformTriggered,
      GesuchAppEventGesuchFormGeschwister.saveTriggered,
      GesuchAppEventGesuchFormGeschwister.saveSubformTriggered,
      GesuchAppEventGesuchFormKinder.saveTriggered,
      GesuchAppEventGesuchFormKinder.saveSubformTriggered,
      GesuchAppEventGesuchFormLebenslauf.saveTriggered,
      GesuchAppEventGesuchFormLebenslauf.saveSubformTriggered,
      GesuchAppEventCockpit.removeTriggered,
      (state): State => ({
        ...state,
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
      (state): State => ({
        ...state,
        loading: false,
        error: undefined,
      })
    ),

    on(
      GesuchAppDataAccessGesuchEvents.gesuchUpdatedSubformSuccess,
      (state): State => ({
        ...state,
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
