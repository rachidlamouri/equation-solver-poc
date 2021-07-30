import { Expression } from './expression.js';

export class VariableExpression extends Expression{
  constructor(properties) {
    const { variableName } = properties;
    super(properties);
    this.name = variableName;
  }

  simplify() {
    return this;
  }

  serialize() {
    return `${this.name}`;
  }
}
