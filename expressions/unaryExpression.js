import { Equation } from '../equation.js';
import { Expression } from './expression.js';
import { parseExpression } from './parseExpression.js';
import { BinaryExpression } from './binaryExpression.js';

export class UnaryExpression extends Expression {
  constructor(properties) {
    const { operator, expression } = properties;
    super(properties);
    this.operator = operator;
    this.expression = expression;
  }

  static split(equation) {
    if (!(equation.leftExpression instanceof UnaryExpression)) {
      throw Error('equation.leftExpression must be a UnaryExpression');
    }

    return new Equation({
      leftExpression: equation.leftExpression.expression,
      rightExpression: new BinaryExpression({
        leftExpression: equation.rightExpression,
        operator: '/',
        rightExpression: parseExpression(equation.leftExpression.operator === '+' ? '1' : '-1'),
      }),
    })
  }

  getVariableNames() {
    return this.expression.getVariableNames();
  }

  isNegative() {
    return this.operator === '-';
  }

  invert() {
    return new UnaryExpression({
      operator: this.operator === '+' ? '-': '+',
      expression: this.expression,
    });
  }

  simplify() {
    if (this.operator === '+') {
      return this.expression.simplify();
    }

    if (this.isNegative() && (this.expression instanceof UnaryExpression) && this.expression.isNegative()) {
      return this.expression.expression.simplify();
    }

    return new UnaryExpression({
      operator: this.operator,
      expression: this.expression.simplify(),
    });
  }

  serialize() {
    return `(${this.operator}${this.expression.serialize()})`;
  }

  compute(variables) {
    const value = this.expression.compute(variables);

    return this.operator === '+'
      ? value
      : -value;
  }
}
