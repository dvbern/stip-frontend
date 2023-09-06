import { createFeature, createReducer, on } from '@ngrx/store';

import { SharedEventGesuchFormEducation } from '@dv/shared/event/gesuch-form-education';
import { SharedEventGesuchFormEltern } from '@dv/shared/event/gesuch-form-eltern';
import { SharedEventGesuchFormFamiliensituation } from '@dv/shared/event/gesuch-form-familiensituation';
import { SharedEventGesuchFormGeschwister } from '@dv/shared/event/gesuch-form-geschwister';
import { SharedEventGesuchFormLebenslauf } from '@dv/shared/event/gesuch-form-lebenslauf';
import { SharedEventGesuchFormPerson } from '@dv/shared/event/gesuch-form-person';
import { SharedEventGesuchFormEinnahmenkosten } from '@dv/shared/event/gesuch-form-einnahmenkosten';
import { SharedModelError } from '@dv/shared/model/error';
import {
  SharedModelGesuch,
  SharedModelGesuchFormular,
} from '@dv/shared/model/gesuch';
import { SharedEventGesuchFormKinder } from '@dv/shared/event/gesuch-form-kinder';

import { sharedDataAccessGesuchEvents } from './shared-data-access-gesuch.events';

export interface State {
  gesuch: SharedModelGesuch | null;
  gesuchFormular: SharedModelGesuchFormular | null;
  gesuchs: SharedModelGesuch[];
  loading: boolean;
  error: SharedModelError | undefined;
}

const initialState: State = {
  gesuch: null,
  gesuchFormular: null,
  gesuchs: [],
  loading: false,
  error: undefined,
};

export const sharedDataAccessGesuchsFeature = createFeature({
  name: 'gesuchs',
  reducer: createReducer(
    initialState,

    on(
      sharedDataAccessGesuchEvents.init,
      (state): State => ({
        ...state,
        gesuchs: [],
      })
    ),

    on(
      sharedDataAccessGesuchEvents.init,
      SharedEventGesuchFormPerson.init,
      SharedEventGesuchFormEducation.init,
      SharedEventGesuchFormFamiliensituation.init,
      SharedEventGesuchFormEltern.init,
      SharedEventGesuchFormGeschwister.init,
      SharedEventGesuchFormKinder.init,
      SharedEventGesuchFormLebenslauf.init,
      SharedEventGesuchFormEinnahmenkosten.init,
      (state): State => ({
        ...state,
        gesuch: null,
        gesuchFormular: null,
        loading: true,
      })
    ),

    on(
      sharedDataAccessGesuchEvents.removeTriggered,
      SharedEventGesuchFormPerson.saveTriggered,
      SharedEventGesuchFormEducation.saveTriggered,
      SharedEventGesuchFormFamiliensituation.saveTriggered,
      SharedEventGesuchFormEltern.saveTriggered,
      SharedEventGesuchFormEltern.saveSubformTriggered,
      SharedEventGesuchFormGeschwister.saveTriggered,
      SharedEventGesuchFormKinder.saveTriggered,
      SharedEventGesuchFormKinder.saveSubformTriggered,
      SharedEventGesuchFormLebenslauf.saveTriggered,
      SharedEventGesuchFormLebenslauf.saveSubformTriggered,
      SharedEventGesuchFormEinnahmenkosten.saveTriggered,
      (state): State => ({
        ...state,
        loading: true,
      })
    ),

    on(
      SharedEventGesuchFormGeschwister.saveSubformTriggered,
      (state): State => ({
        ...state,
        loading: true,
        gesuchFormular: state.gesuchFormular
          ? {
              ...state.gesuchFormular,
              geschwisters: [],
            }
          : null,
      })
    ),

    on(
      sharedDataAccessGesuchEvents.gesuchsLoadedSuccess,
      (state, { gesuchs }): State => ({
        ...state,
        gesuchs,
        loading: false,
        error: undefined,
      })
    ),

    on(
      sharedDataAccessGesuchEvents.gesuchLoadedSuccess,
      (state, { gesuch }): State => ({
        ...state,
        gesuch,
        gesuchFormular: getGesuchFormular(gesuch),
        loading: false,
        error: undefined,
      })
    ),

    on(
      sharedDataAccessGesuchEvents.gesuchUpdatedSuccess,
      sharedDataAccessGesuchEvents.gesuchRemovedSuccess,
      (state): State => ({
        ...state,
        loading: false,
        error: undefined,
      })
    ),

    on(
      sharedDataAccessGesuchEvents.gesuchUpdatedSubformSuccess,
      (state): State => ({
        ...state,
        error: undefined,
      })
    ),

    on(
      sharedDataAccessGesuchEvents.gesuchsLoadedFailure,
      sharedDataAccessGesuchEvents.gesuchLoadedFailure,
      sharedDataAccessGesuchEvents.gesuchCreatedFailure,
      sharedDataAccessGesuchEvents.gesuchUpdatedFailure,
      sharedDataAccessGesuchEvents.gesuchUpdatedSubformFailure,
      sharedDataAccessGesuchEvents.gesuchRemovedFailure,
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
} = sharedDataAccessGesuchsFeature;

const getGesuchFormular = (
  gesuch: SharedModelGesuch
): SharedModelGesuchFormular | null => {
  const formular =
    // TODO: Fix mapping from GET GesuchFormular to PATCH GesuchFormularUpdate
    (gesuch.gesuch_formular_freigabe_copy ??
      gesuch.gesuch_formular_to_work_with) as SharedModelGesuchFormular;
  return formular;
};
