import { sharedUtilFnTypeGuardsIsDefined } from './shared-util-fn-type-guards';

describe('sharedUtilFnTypeGuardsIsDefined', () => {
  it('should narrow type to defined', () => {
    interface Example {
      value?: string;
    }

    const example: Example[] = [{}, {}, { value: 'test' }];
    const result = example
      .map((e) => e.value)
      .filter(sharedUtilFnTypeGuardsIsDefined);
    expect(result.length).toBe(1);
    // impossible to test narrowed type at runtime
  });
});
