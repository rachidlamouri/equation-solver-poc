import { Equation } from '../equation.js';
import { BinaryExpression } from './binaryExpression.js';
import { ConstantExpression } from './constantExpression.js';

export class UnaryExpression {
  constructor({ operator, operand }) {
    if (!['+', '-'].includes(operator)) {
      throw Error(`Unexpected unary operator "${operator}"`);
    }

    this.operator = operator;
    this.operand = operand;
  }

  static parse(unaryExpression) {
    if (unaryExpression.length !== 2) {
      throw Error('Expected an array with 2 elements: operator, rightExpression');
    }

    const [operator, expression] = unaryExpression;
    return new UnaryExpression({
      operator,
      operand: expression,
    });
  }

  static split(equation) {
    if (!(equation.leftExpression instanceof UnaryExpression)) {
      throw Error('equation.leftExpression must be a UnaryExpression');
    }

    return new Equation({
      leftExpression: equation.leftExpression.operand,
      rightExpression: new BinaryExpression({
        leftOperand: equation.rightExpression,
        operator: '/',
        rightOperand: ConstantExpression.parse(equation.leftExpression.operator === '+' ? 1 : -1),
      }),
    })
  }

  isNegative() {
    return this.operator === '-';
  }

  invert() {
    return new UnaryExpression({
      operator: this.operator === '+' ? '-': '+',
      operand: this.operand,
    });
  }

  simplify() {
    if (this.operator === '+') {
      return this.operand.simplify();
    }

    if (this.isNegative() && (this.operand instanceof UnaryExpression) && this.operand.isNegative()) {
      return this.operand.operand.simplify();
    }

    return new UnaryExpression({
      operator: this.operator,
      operand: this.operand.simplify(),
    });
  }

  serialize() {
    return `(${this.operator}${this.operand.serialize()})`;
  }
}
