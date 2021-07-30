import { Expression } from './expression.js';

export class ConstantExpression extends Expression{
  constructor(properties) {
    const { constantValue } = properties;
    super(properties);
    this.value = constantValue;
  }

  isZero() {
    return this.value === 0;
  }

  isOne() {
    return this.value === 1;
  }

  simplify() {
    return this;
  }

  serialize() {
    return `${this.value}`;
  }
}
