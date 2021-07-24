export class VariableExpression {
  constructor(name) {
    this.name = name;
  }

  static parse(variableName) {
    if (!/^[a-zA-Z]+$/.test(variableName)) {
      throw Error(`Invalid variable name "${variableName}", must contain letters only`);
    }

    return new VariableExpression(variableName);
  }

  simplify() {
    return this;
  }

  serialize() {
    return `${this.name}`;
  }
}
