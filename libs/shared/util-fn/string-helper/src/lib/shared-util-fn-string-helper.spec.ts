import { capitalized, lowercased } from './shared-util-fn-string-helper';

describe('sharedUtilFnStringHelper', () => {
  it('capitalized should also work during design time', () => {
    expect(capitalized('test') === 'Test').toBe(true);
  });
  it.each([
    ['test', 'Test'],
    ['Test', 'Test'],
    ['TEST', 'Test'],
    ['tEST', 'Test'],
    ['', ''],
  ])('capitalized(%s) should return %s', (input, expected) => {
    expect(capitalized(input)).toEqual(expected);
  });

  it('lowercased should also work during design time', () => {
    expect(lowercased('Test') === 'test').toBe(true);
  });
  it.each([
    ['test', 'test'],
    ['Test', 'test'],
    ['TEST', 'test'],
    ['tEST', 'test'],
    ['', ''],
  ])('lowercased(%s) should return %s', (input, expected) => {
    expect(lowercased(input)).toEqual(expected);
  });
});
