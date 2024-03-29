export function sharedUtilFnTypeGuardsIsDefined<T>(
  value: T | null | undefined
): value is NonNullable<T> {
  return value !== undefined && value !== null;
}
