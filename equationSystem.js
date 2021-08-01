import _ from 'lodash';

export class EquationSystem {
  constructor(equations) {
    this.equations = equations;
    this.variableNames = this.equations[0].getVariableNames();
  }

  serialize() {
    return this.equations.map((equation) => equation.simplify().serialize());
  }

  compute (variables) {
    const unknownVariableNames = this.variableNames.filter((variableName) => variables[variableName] === null);

    if (unknownVariableNames.length === 0) {
      return variables;
    }

    if (unknownVariableNames.length > 1) {
      throw Error(`More than one unknown variable: ${unknownVariableNames.join(', ')}`)
    }

    const [unknownVariableName] = unknownVariableNames;
    const equation = this.equations.find((equation) => equation.leftExpression.name === unknownVariableName);

    return {
      ...variables,
      [unknownVariableName]: equation.compute(variables),
    };
  }
}
