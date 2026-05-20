import {
  extractGraphVariableNamesFromLatex,
  findUndefinedGraphVariables,
} from './graphEquationVariables';

describe('graphEquationVariables', () => {
  it('does not treat x or ax as undefined variables', () => {
    expect(
      findUndefinedGraphVariables('y=ax^2', [], { x: 'x', y: 'y' }),
    ).toEqual(['a']);
    expect(extractGraphVariableNamesFromLatex('y=x^2')).toEqual([]);
    expect(extractGraphVariableNamesFromLatex('y=ax^2')).toEqual(['a']);
  });

  it('flags only missing slider names', () => {
    expect(
      findUndefinedGraphVariables('y=ax^2', ['a'], { x: 'x', y: 'y' }),
    ).toEqual([]);
  });
});
