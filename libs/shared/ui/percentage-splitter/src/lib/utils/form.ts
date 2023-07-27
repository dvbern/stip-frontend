export function percentStringToNumber(
  value?: string | undefined
): number | undefined {
  const parsed = parseInt(value || '');
  if (isNaN(parsed)) {
    return undefined;
  } else {
    return parsed;
  }
}

export function numberToPercentString(value?: number): string {
  return value?.toString() || '';
}
