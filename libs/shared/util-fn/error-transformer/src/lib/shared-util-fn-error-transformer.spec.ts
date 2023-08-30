import { sharedUtilFnErrorTransformer } from './shared-util-fn-error-transformer';

describe('sharedUtilFnErrorTransformer', () => {
  it('should extract error message', () => {
    expect(sharedUtilFnErrorTransformer(new Error('boom'))).toEqual({
      message: 'boom',
    });
  });
  it('should use default message as fallback message', () => {
    expect(sharedUtilFnErrorTransformer('unknown error')).toEqual({
      message: 'Something went wrong',
    });
  });
});
