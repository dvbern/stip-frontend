import {
  SharedPatternNgbDatepickerDateAdapter,
  SharedPatternNgbDatepickerParserFormatter,
} from './shared-pattern-ngb-datepicker-adapter';

describe('shared-pattern-ngb-datepicker-adapter', () => {
  describe('SharedPatternNgbDatepickerParserFormatter', () => {
    it('formats date to be displayed in the input', () => {
      const sut = new SharedPatternNgbDatepickerParserFormatter();
      expect(sut.format({ year: 2020, month: 1, day: 1 })).toBe('01.01.2020');
      expect(sut.format(null)).toBe('');
    });

    it('parses date from the input into NGB data structure', () => {
      const sut = new SharedPatternNgbDatepickerParserFormatter();
      expect(sut.parse('01.01.2020')).toEqual({ year: 2020, month: 1, day: 1 });
      expect(sut.parse('')).toBeNull();
    });
  });

  describe('SharedPatternNgbDatepickerDateAdapter', () => {
    it('transforms date from DV model to NGB data structure', () => {
      const sut = new SharedPatternNgbDatepickerDateAdapter();
      expect(sut.fromModel('2020-01-01')).toEqual({
        year: 2020,
        month: 1,
        day: 1,
      });
      expect(sut.fromModel(null)).toBeNull();
    });
    it('transforms date NGB data structure to DV model', () => {
      const sut = new SharedPatternNgbDatepickerDateAdapter();
      expect(sut.toModel({ year: 2020, month: 1, day: 1 })).toBe('2020-01-01');
      expect(sut.toModel(null)).toBeNull();
    });
  });
});
