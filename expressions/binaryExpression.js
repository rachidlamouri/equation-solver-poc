import { parseExpression } from './parseExpression.js';
import { UnaryExpression } from './unaryExpression.js';

export class BinaryExpression {
  constructor({ leftOperand, operator, rightOperand }) {
    if (!['+', '-', '/', '*'].includes(operator)) {
      throw Error(`Unexpected infix operator "${operator}"`);
    }

    this.leftOperand = leftOperand;
    this.operator = operator;
    this.rightOperand = rightOperand;
  }

  static parse(binaryExpression) {
    if (binaryExpression.length !== 3) {
      throw Error('Expected an array with 3 elements: leftExpression, operator, rightExpression');
    }

    const [leftExpression, operator, rightExpression] = binaryExpression;
    return new BinaryExpression({
      leftOperand: parseExpression(leftExpression),
      operator,
      rightOperand: parseExpression(rightExpression),
    });
  }
}
