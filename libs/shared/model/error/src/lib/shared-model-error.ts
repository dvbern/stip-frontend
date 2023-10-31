import { z } from 'zod';

import {
  ValidationError as DvValidationError,
  ValidationReport,
} from '@dv/shared/model/gesuch';

// eslint-disable-next-line @typescript-eslint/no-unused-vars
type Extends<T, _U extends T> = T;

export const ValidationError = z.object({
  messageTemplate: z.string(),
  message: z.string(),
  propertyPath: z
    .string()
    .nullable()
    .transform((value) => value ?? undefined),
});

export type ValidationError = Extends<
  z.infer<typeof ValidationError>,
  DvValidationError
>;

const ErrorTypes = {
  validationError: z.object({
    error: z.object({
      validationErrors: z.array(ValidationError),
    }),
  }),
  unknownHttpError: z.object({
    error: z.string().or(z.record(z.unknown())),
  }),
  unknownError: z.unknown(),
};
type ErrorTypes = {
  [K in keyof typeof ErrorTypes]: Extends<
    z.infer<(typeof ErrorTypes)[K]>,
    ValidationReport
  >;
};

export type SharedModelErrorTypes = keyof typeof ErrorTypes;

export const SharedModelError = z.intersection(
  z.union([
    ErrorTypes.validationError.transform(({ error: { validationErrors } }) =>
      createError('validationError', {
        message: validationErrors[0]?.message,
        messageKey: 'shared.genericError.validation',
        validationErrors,
      })
    ),
    ErrorTypes.unknownHttpError.transform(({ error }) => {
      return createError('unknownHttpError', {
        messageKey: 'shared.genericError.http',
        error,
      });
    }),
    ErrorTypes.unknownError.transform((error) =>
      createError('unknownError', {
        messageKey: 'shared.genericError.general',
        error,
      })
    ),
  ]),
  z.object({
    status: z
      .number()
      .or(z.string().transform((x) => +x))
      .optional(),
  })
);

export type SharedModelError = z.infer<typeof SharedModelError>;

const createError = <K extends SharedModelErrorTypes, T>(
  type: K,
  data: T & { messageKey: string; message?: string }
) => ({
  type,
  ...data,
});
