import { SharedModelError } from '@dv/shared/model/error';

export function sharedUtilFnErrorTransformer(error: any): SharedModelError {
  return {
    message: error?.message || 'Something went wrong',
    status: error?.status,
  };
}
