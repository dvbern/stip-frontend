import { GesuchAppEventCockpit } from '@dv/gesuch-app/event/cockpit';
import { GesuchAppEventGesuchFormEducation } from '@dv/gesuch-app/event/gesuch-form-education';
import { GesuchAppEventGesuchFormEltern } from '@dv/gesuch-app/event/gesuch-form-eltern';
import { GesuchAppEventGesuchFormFamiliensituation } from '@dv/gesuch-app/event/gesuch-form-familiensituation';
import { GesuchAppEventGesuchFormGeschwister } from '@dv/gesuch-app/event/gesuch-form-geschwister';
import { GesuchAppEventGesuchFormLebenslauf } from '@dv/gesuch-app/event/gesuch-form-lebenslauf';
import { GesuchAppEventGesuchFormPerson } from '@dv/gesuch-app/event/gesuch-form-person';

import { SharedModelError } from '@dv/shared/model/error';
import {
  SharedModelGesuch,
  SharedModelGesuchFormular,
} from '@dv/shared/model/gesuch';
import { createFeature, createReducer, on } from '@ngrx/store';

import { GesuchAppDataAccessGesuchEvents } from './gesuch-app-data-access-gesuch.events';
import { GesuchAppEventGesuchFormKinder } from '@dv/gesuch-app/event/gesuch-form-kinder';

export interface State {
  gesuch: SharedModelGesuch | undefined;
  gesuchFormular: SharedModelGesuchFormular | undefined;
  gesuchs: SharedModelGesuch[];
  loading: boolean;
  error: SharedModelError | undefined;
}

const initialState: State = {
  gesuch: undefined,
  gesuchFormular: undefined,
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
        gesuchFormular: undefined,
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
      GesuchAppEventGesuchFormGeschwister.saveSubformTriggered,
      (state): State => ({
        ...state,
        loading: true,
        gesuchFormular: state.gesuchFormular
          ? {
              ...state.gesuchFormular,
              geschwisters: [],
            }
          : undefined,
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
        gesuchFormular: getGesuchFormular(gesuch),
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

const getGesuchFormular = (
  gesuch: SharedModelGesuch
): SharedModelGesuchFormular | undefined => {
  const formular =
    // TODO: Fix mapping from GET GesuchFormular to PATCH GesuchFormularUpdate
    (gesuch.gesuch_formular_freigabe_copy ??
      gesuch.gesuch_formular_to_work_with) as SharedModelGesuchFormular;
  return formular
    ? { ...formular, freigegeben: !!gesuch.gesuch_formular_freigabe_copy }
    : undefined;
};
