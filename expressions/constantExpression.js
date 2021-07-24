export class ConstantExpression{
  constructor(value) {
    this.value = value;
  }

  static parse(value) {
    return new ConstantExpression(value);
  }
}
