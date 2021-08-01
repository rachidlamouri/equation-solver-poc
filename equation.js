import { VariableExpression } from './expressions/index.js';

export class Equation {
  constructor({ leftExpression, rightExpression}) {
    this.leftExpression = leftExpression;
    this.rightExpression = rightExpression;
  }

  getVariableNames() {
    return [
      ...this.leftExpression.getVariableNames(),
      ...this.rightExpression.getVariableNames(),
    ];
  }

  simplify() {
    return new Equation({
      leftExpression: this.leftExpression.simplify(),
      rightExpression: this.rightExpression.simplify(),
    })
  }

  serialize() {
    return `${this.leftExpression.serialize()} = ${this.rightExpression.serialize()}`
  }

  compute(values) {
    if (!(this.leftExpression instanceof VariableExpression)) {
      throw Error('Left hand side must be a VariableExpression');
    }

    return this.rightExpression.compute(values);
  }
}
