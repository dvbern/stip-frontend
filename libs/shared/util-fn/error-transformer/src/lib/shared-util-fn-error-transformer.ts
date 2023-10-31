import {
  SharedModelError,
  SharedModelErrorTypes,
} from '@dv/shared/model/error';

export function sharedUtilFnErrorTransformer(error: unknown): SharedModelError {
  const parsed = SharedModelError.safeParse(error);

  if (!parsed.success) {
    return {
      type: 'unknownError',
      error,
      message: 'Unknown Error',
      messageKey: 'shared.genericError.general',
    };
  }
  return parsed.data;
}

/**
 * Filter given {@link SharedModelError} by type
 * @example
 *
 *  errors
 *    .filter(byErrorType('validationError'))
 *    .map(e => e.validationErrors)
 *
 *  of(error)
 *    .pipe(
 *      filter(byErrorType('validationError')),
 *      map(e => e.validationErrors)
 *    )
 *
 *  switch (error.type) {
 *    case 'validationError':
 *      error.validationErrors;
 *  }
 *
 * @param type
 * @returns
 */
export const byErrorType = <K extends SharedModelErrorTypes>(type: K) => {
  return (
    error: SharedModelError
  ): error is Extract<SharedModelError, { type: K }> => {
    return error.type === type;
  };
};
