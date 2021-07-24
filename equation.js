export class Equation {
  constructor({ leftExpression, rightExpression}) {
    this.leftExpression = leftExpression;
    this.rightExpression = rightExpression;
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
}
