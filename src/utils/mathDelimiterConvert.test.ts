import { findDelimiterMatches } from './mathDelimiterConvert';

describe('findDelimiterMatches', () => {
  const inline = /\\\((.+?)\\\)/g;

  it('finds a complete inline pair', () => {
    const text = '\\(\\frac{x+2}{5}\\)';
    expect(findDelimiterMatches(text, inline)).toEqual([
      { contentFrom: 0, contentTo: text.length, latex: '\\frac{x+2}{5}' },
    ]);
  });

  it('ignores incomplete openers without a closer', () => {
    expect(findDelimiterMatches('\\(\\frac{x+2}{5}', inline)).toEqual([]);
  });

  it('ignores a closer without an opener', () => {
    expect(findDelimiterMatches('\\frac{x+2}{5}\\)', inline)).toEqual([]);
  });

  it('finds a pair completed by a leading backslash before (', () => {
    expect(findDelimiterMatches('(\\frac{x+2}{5}\\)', inline)).toEqual([]);
    const text = '\\(\\frac{x+2}{5}\\)';
    expect(findDelimiterMatches(text, inline)).toEqual([
      { contentFrom: 0, contentTo: text.length, latex: '\\frac{x+2}{5}' },
    ]);
  });

  it('skips empty pairs', () => {
    expect(findDelimiterMatches('\\(\\)', inline)).toEqual([]);
    expect(findDelimiterMatches('\\(   \\)', inline)).toEqual([]);
  });
});
