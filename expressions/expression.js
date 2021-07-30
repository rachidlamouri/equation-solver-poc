export class Expression {
  constructor({ type, input }) {
    this.type = this.constructor.name;
    this.input = input;
  }
}
