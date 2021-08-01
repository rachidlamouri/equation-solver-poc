import { Expression } from './expression.js';
import { UnaryExpression } from './unaryExpression.js';
import { Equation } from '../equation.js';
import { ConstantExpression } from './constantExpression.js';

export class BinaryExpression extends Expression {
  constructor(properties) {
    const { leftExpression, operator, rightExpression } = properties;
    super(properties);
    this.leftExpression = leftExpression;
    this.operator = operator;
    this.rightExpression = rightExpression;
  }

  static split(equation) {
    if (!(equation.leftExpression instanceof BinaryExpression)) {
      throw Error('equation.leftExpression must be a BinaryExpression');
    }

    const { leftExpression, operator, rightExpression } = equation.leftExpression;

    if (['-', '+'].includes(operator)) {
      const rightUnaryExpression = new UnaryExpression({
        operator,
        expression: rightExpression,
      });

      const equationA = new Equation({
        leftExpression,
        rightExpression: new BinaryExpression({
          leftExpression: equation.rightExpression,
          operator: '-',
          rightExpression: rightUnaryExpression,
        }),
      });

      const equationB = new Equation({
        leftExpression: rightUnaryExpression,
        rightExpression: new BinaryExpression({
          leftExpression: equation.rightExpression,
          operator: '-',
          rightExpression: leftExpression,
        }),
      });

      return [
        equationA,
        equationB,
      ];
    }

    if (operator === '*') {
      const equationA = new Equation({
        leftExpression,
        rightExpression: new BinaryExpression({
          leftExpression: equation.rightExpression,
          operator: '/',
          rightExpression,
        })
      });

      const equationB  = new Equation({
        leftExpression: rightExpression,
        rightExpression: new BinaryExpression({
          leftExpression: equation.rightExpression,
          operator: '/',
          rightExpression: leftExpression,
        })
      });

      return [
        equationA,
        equationB,
      ];
    }

    const equationA = new Equation({
      leftExpression,
      rightExpression: new BinaryExpression({
        leftExpression: equation.rightExpression,
        operator: '*',
        rightExpression,
      })
    });

    const equationB  = new Equation({
      leftExpression: rightExpression,
      rightExpression: new BinaryExpression({
        leftExpression,
        operator: '/',
        rightExpression: equation.rightExpression,
      })
    });

    return [
      equationA,
      equationB,
    ];
  }

  getVariableNames() {
    return [
      ...this.leftExpression.getVariableNames(),
      ...this.rightExpression.getVariableNames(),
    ];
  }

  simplify() {
    const isAddition = this.operator === '+';
    const isSubtraction = this.operator === '-';
    const isMultiplication = this.operator === '*';
    const isDivision = this.operator === '/';

    const simplifiedLeftExpression = this.leftExpression.simplify();
    const simplifiedRightExpression = this.rightExpression.simplify();

    const isLeftZero = (simplifiedLeftExpression instanceof ConstantExpression) && simplifiedLeftExpression.isZero()
    const isRightZero = (simplifiedRightExpression instanceof ConstantExpression) && simplifiedRightExpression.isZero();

    const isLeftOne = (simplifiedLeftExpression instanceof ConstantExpression) && simplifiedLeftExpression.isOne()
    const isRightOne = (simplifiedRightExpression instanceof ConstantExpression) && simplifiedRightExpression.isOne();

    const isLeftNegative = (simplifiedLeftExpression instanceof UnaryExpression) && simplifiedLeftExpression.isNegative();
    const isRightNegative = (simplifiedRightExpression instanceof UnaryExpression) && simplifiedRightExpression.isNegative();

    if ((isAddition || isSubtraction) && isLeftZero) {
      return new UnaryExpression({
        operator: this.operator,
        expression: simplifiedRightExpression,
      })
        .simplify();
    }

    if ((isAddition || isSubtraction) && isRightZero) {
      return simplifiedLeftExpression;
    }

    if (isSubtraction && isRightNegative) {
      return new BinaryExpression({
        leftExpression: simplifiedLeftExpression,
        operator: '+',
        rightExpression: simplifiedRightExpression.expression,
      })
        .simplify();
    }

    if ((isMultiplication || isDivision) && isLeftNegative && isRightNegative) {
      return new BinaryExpression({
        leftExpression: simplifiedLeftExpression.invert().simplify(),
        operator: this.operator,
        rightExpression: simplifiedRightExpression.invert().simplify(),
      })
        .simplify();
    }

    if ((isMultiplication || isDivision) && isLeftNegative) {
      return new UnaryExpression({
        operator: '-',
        expression: new BinaryExpression({
          leftExpression: simplifiedLeftExpression.invert().simplify(),
          operator: this.operator,
          rightExpression: simplifiedRightExpression,
        })
          .simplify(),
      });
    }

    if ((isMultiplication || isDivision) && isRightNegative) {
      return new UnaryExpression({
        operator: '-',
        expression: new BinaryExpression({
          leftExpression: simplifiedLeftExpression,
          operator: this.operator,
          rightExpression: simplifiedRightExpression.invert().simplify(),
        })
          .simplify(),
      });
    }

    if ((isMultiplication || isDivision) && isRightOne) {
      return simplifiedLeftExpression;
    }

    if (isMultiplication && isLeftOne) {
      return simplifiedRightExpression;
    }

    return new BinaryExpression({
      leftExpression: simplifiedLeftExpression,
      operator: this.operator,
      rightExpression: simplifiedRightExpression,
    });
  }

  serialize() {
    return `(${this.leftExpression.serialize()} ${this.operator} ${this.rightExpression.serialize()})`;
  }

  compute(variables) {
    const leftValue = this.leftExpression.compute(variables);
    const rightValue = this.rightExpression.compute(variables);

    switch (this.operator) {
      case '+': return leftValue + rightValue;
      case '-': return leftValue - rightValue;
      case '/': return leftValue / rightValue;
      default: return leftValue * rightValue;
    }
  }
}
