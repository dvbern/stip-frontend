import { fromFormatedNumber } from './shared-util-maskito-util';

describe('shared-util-maskito-util', () => {
  it('should transform empty string to null', () => {
    expect(fromFormatedNumber('')).toBeNull();
  });
  it('should transform string of whitespace only to null', () => {
    expect(fromFormatedNumber('    ')).toBeNull();
  });

  it('should transform null to null', () => {
    expect(fromFormatedNumber(null)).toBeNull();
  });

  it('should transform undefined string to undefined', () => {
    expect(fromFormatedNumber(undefined)).toBeUndefined();
  });

  it("should not transform number without '", () => {
    expect(fromFormatedNumber('1')).toBe(1);
  });
  it("should transform number with one '", () => {
    expect(fromFormatedNumber("2'000")).toBe(2000);
  });
  it("should transform number with multiple '", () => {
    expect(fromFormatedNumber("2'000'000")).toBe(2000000);
  });
});
