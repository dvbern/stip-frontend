import { createFeature, createReducer, on } from '@ngrx/store';

import { GesuchAppEventGesuchFormEducation } from '@dv/shared/event/gesuch-form-education';
import { GesuchAppEventGesuchFormEltern } from '@dv/shared/event/gesuch-form-eltern';
import { GesuchAppEventGesuchFormFamiliensituation } from '@dv/shared/event/gesuch-form-familiensituation';
import { GesuchAppEventGesuchFormGeschwister } from '@dv/shared/event/gesuch-form-geschwister';
import { GesuchAppEventGesuchFormLebenslauf } from '@dv/shared/event/gesuch-form-lebenslauf';
import { GesuchAppEventGesuchFormPerson } from '@dv/shared/event/gesuch-form-person';
import { GesuchAppEventGesuchFormEinnahmenkosten } from '@dv/shared/event/gesuch-form-einnahmenkosten';
import { SharedModelError } from '@dv/shared/model/error';
import {
  SharedModelGesuch,
  SharedModelGesuchFormular,
} from '@dv/shared/model/gesuch';
import { GesuchAppEventGesuchFormKinder } from '@dv/shared/event/gesuch-form-kinder';

import { GesuchAppDataAccessGesuchEvents } from './shared-data-access-gesuch.events';

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

export const gesuchAppDataAccessGesuchsFeature = createFeature({
  name: 'gesuchs',
  reducer: createReducer(
    initialState,

    on(
      GesuchAppDataAccessGesuchEvents.init,
      (state): State => ({
        ...state,
        gesuchs: [],
      })
    ),

    on(
      GesuchAppDataAccessGesuchEvents.init,
      GesuchAppEventGesuchFormPerson.init,
      GesuchAppEventGesuchFormEducation.init,
      GesuchAppEventGesuchFormFamiliensituation.init,
      GesuchAppEventGesuchFormEltern.init,
      GesuchAppEventGesuchFormGeschwister.init,
      GesuchAppEventGesuchFormKinder.init,
      GesuchAppEventGesuchFormLebenslauf.init,
      GesuchAppEventGesuchFormEinnahmenkosten.init,
      (state): State => ({
        ...state,
        gesuch: null,
        gesuchFormular: null,
        loading: true,
      })
    ),

    on(
      GesuchAppDataAccessGesuchEvents.removeTriggered,
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
      GesuchAppEventGesuchFormEinnahmenkosten.saveTriggered,
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
          : null,
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
): SharedModelGesuchFormular | null => {
  const formular =
    // TODO: Fix mapping from GET GesuchFormular to PATCH GesuchFormularUpdate
    (gesuch.gesuch_formular_freigabe_copy ??
      gesuch.gesuch_formular_to_work_with) as SharedModelGesuchFormular;
  return formular;
};
