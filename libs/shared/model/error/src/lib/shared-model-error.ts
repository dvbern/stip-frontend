import { z } from 'zod';

import {
  ValidationError as DvValidationError,
  ValidationReport,
} from '@dv/shared/model/gesuch';

export const ValidationError = z.object({
  messageTemplate: z.string(),
  message: z.string(),
  propertyPath: z.string().optional(),
}) satisfies z.ZodType<DvValidationError>;

export type ValidationError = z.infer<typeof ValidationError>;

const ErrorTypes = {
  validationError: z.object({
    error: z.object({
      validationErrors: z.array(ValidationError),
    }) satisfies z.ZodType<ValidationReport>,
  }),
  unknownHttpError: z.object({
    error: z.string().or(z.record(z.unknown())),
  }),
  unknownError: z.unknown(),
};
type ErrorTypes = {
  [K in keyof typeof ErrorTypes]: z.infer<(typeof ErrorTypes)[K]>;
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
