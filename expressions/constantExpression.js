import { UnaryExpression } from './unaryExpression.js';

export class ConstantExpression{
  constructor(value) {
    this.value = value;
  }

  static parse(value) {
    const constantExpression = new ConstantExpression(Math.abs(value));

    return value < 0
      ? new UnaryExpression({
        operator: '-',
        operand: constantExpression
      })
      : constantExpression;
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
