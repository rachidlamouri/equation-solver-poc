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
}
