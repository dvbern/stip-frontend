import {
  byErrorType,
  sharedUtilFnErrorTransformer,
} from './shared-util-fn-error-transformer';

describe('sharedUtilFnErrorTransformer - fn', () => {
  it('should use default message as fallback message', () => {
    const error = sharedUtilFnErrorTransformer('unknown error');
    expect(error).toEqual({
      type: 'unknownError',
      error: 'unknown error',
      message: 'Unknown Error',
    });
  });
  it('should extract error message', () => {
    const error = new Error('boom');
    expect(sharedUtilFnErrorTransformer(error)).toEqual({
      type: 'unknownError',
      error,
      message: 'boom',
    });
  });
  it('should extract validation errors', () => {
    const validationErrors = [
      {
        messageTemplate:
          'dvbern.stip.validation.gesuch.einreichen.svnummer.unique.message',
        message: 'Es darf nur ein Gesuch pro Gesuchsteller eingereicht werden',
        propertyPath: null,
      },
    ];
    const error = {
      error: {
        validationErrors,
      },
      message: 'Bad Request',
      status: 400,
    };
    expect(sharedUtilFnErrorTransformer(error)).toEqual({
      type: 'validationError',
      validationErrors,
      message: error.message,
      status: error.status,
    });
  });
});
describe('sharedUtilFnErrorTransformer - filter', () => {
  const validationErrorsCollection = [
    [
      {
        messageTemplate: 'dv.error.validation.1',
        message: 'error validation 1',
      },
      {
        messageTemplate: 'dv.error.validation.2',
        message: 'error validation 2',
        propertyPath: 'foo.bar.baz',
      },
    ],
    [
      {
        messageTemplate: 'dv.error.validation.3',
        message: 'error validation 1',
      },
    ],
  ];
  const rawErrors = [
    'error 2',
    new Error('error 3'),
    {
      error: new Error('error 1'),
    },
    {
      error: {
        stack: '1/2/3',
      },
      message: 'Internal Server Error',
      status: 500,
    },
    {
      error: {
        validationErrors: validationErrorsCollection[0],
      },
      message: 'Bad Request',
      status: 400,
    },
    {
      error: {
        validationErrors: validationErrorsCollection[1],
      },
      message: 'Bad Request',
      status: 400,
    },
  ];

  it('should filter a stream of errors by validationError', () => {
    const errors = rawErrors
      .map(sharedUtilFnErrorTransformer)
      .filter(byErrorType('validationError'));
    expect(errors).toEqual([
      {
        type: 'validationError',
        validationErrors: validationErrorsCollection[0],
        message: 'Bad Request',
        status: 400,
      },
      {
        type: 'validationError',
        validationErrors: validationErrorsCollection[1],
        message: 'Bad Request',
        status: 400,
      },
    ]);
  });
});
