import { format, parseISO } from 'date-fns';

/**
 * Iso-Format: 1999-01-01
 */
export type BackendLocalDateTS = string;

export function toBackendLocalDate(
  value: Date | null | undefined
): BackendLocalDateTS | undefined {
  if (value === null || value === undefined) {
    return undefined;
  }

  return format(value, 'yyyy-MM-dd');
}

export function fromBackendLocalDate(
  value: BackendLocalDateTS | null | undefined
): Date | undefined {
  return value ? parseISO(value) : undefined;
}
