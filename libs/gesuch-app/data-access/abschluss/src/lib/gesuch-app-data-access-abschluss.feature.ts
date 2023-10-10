import { createFeature, createReducer } from '@ngrx/store';

import { SharedModelError } from '@dv/shared/model/error';

export interface State {
  loading: boolean;
  error: SharedModelError | undefined;
}

const initialState: State = {
  loading: false,
  error: undefined,
};

export const gesuchAppDataAccessAbschlussFeature = createFeature({
  name: 'abschluss',
  reducer: createReducer(initialState),
});

export const {
  name, // feature name
  reducer,
  selectAbschlussState,
  selectLoading,
  selectError,
} = gesuchAppDataAccessAbschlussFeature;
