import { parseExpression } from './parseExpression.js';
import { UnaryExpression } from './unaryExpression.js';
import { Equation } from '../equation.js';
import { ConstantExpression } from './constantExpression.js';

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

  static split(equation) {
    if (!(equation.leftExpression instanceof BinaryExpression)) {
      throw Error('equation.leftExpression must be a BinaryExpression');
    }

    const { leftOperand, operator, rightOperand } = equation.leftExpression;

    if (['-', '+'].includes(operator)) {
      const rightUnaryExpression = new UnaryExpression({
        operator,
        operand: rightOperand,
      });

      const equationA = new Equation({
        leftExpression: leftOperand,
        rightExpression: new BinaryExpression({
          leftOperand: equation.rightExpression,
          operator: '-',
          rightOperand: rightUnaryExpression,
        }),
      });

      const equationB = new Equation({
        leftExpression: rightUnaryExpression,
        rightExpression: new BinaryExpression({
          leftOperand: equation.rightExpression,
          operator: '-',
          rightOperand: leftOperand,
        }),
      });

      return [
        equationA,
        equationB,
      ];
    }

    if (operator === '*') {
      const equationA = new Equation({
        leftExpression: leftOperand,
        rightExpression: new BinaryExpression({
          leftOperand: equation.rightExpression,
          operator: '/',
          rightOperand,
        })
      });

      const equationB  = new Equation({
        leftExpression: rightOperand,
        rightExpression: new BinaryExpression({
          leftOperand: equation.rightExpression,
          operator: '/',
          rightOperand: leftOperand,
        })
      });

      return [
        equationA,
        equationB,
      ];
    }

    const equationA = new Equation({
      leftExpression: leftOperand,
      rightExpression: new BinaryExpression({
        leftOperand: equation.rightExpression,
        operator: '*',
        rightOperand,
      })
    });

    const equationB  = new Equation({
      leftExpression: rightOperand,
      rightExpression: new BinaryExpression({
        leftOperand,
        operator: '/',
        rightOperand: equation.rightExpression,
      })
    });

    return [
      equationA,
      equationB,
    ];
  }

  simplify() {
    const isAddition = this.operator === '+';
    const isSubtraction = this.operator === '-';
    const isMultiplication = this.operator === '*';
    const isDivision = this.operator === '/';

    const simplifiedLeftOperand = this.leftOperand.simplify();
    const simplifiedRightOperand = this.rightOperand.simplify();

    const isLeftZero = (simplifiedLeftOperand instanceof ConstantExpression) && simplifiedLeftOperand.isZero()
    const isRightZero = (simplifiedRightOperand instanceof ConstantExpression) && simplifiedRightOperand.isZero();

    const isLeftOne = (simplifiedLeftOperand instanceof ConstantExpression) && simplifiedLeftOperand.isOne()
    const isRightOne = (simplifiedRightOperand instanceof ConstantExpression) && simplifiedRightOperand.isOne();

    const isLeftNegative = (simplifiedLeftOperand instanceof UnaryExpression) && simplifiedLeftOperand.isNegative();
    const isRightNegative = (simplifiedRightOperand instanceof UnaryExpression) && simplifiedRightOperand.isNegative();

    if ((isAddition || isSubtraction) && isLeftZero) {
      return new UnaryExpression({
        operator: this.operator,
        operand: simplifiedRightOperand,
      })
        .simplify();
    }

    if ((isAddition || isSubtraction) && isRightZero) {
      return simplifiedLeftOperand;
    }

    if (isSubtraction && isRightNegative) {
      return new BinaryExpression({
        leftOperand: simplifiedLeftOperand,
        operator: '+',
        rightOperand: simplifiedRightOperand.operand,
      })
        .simplify();
    }

    if ((isMultiplication || isDivision) && isLeftNegative && isRightNegative) {
      return new BinaryExpression({
        leftOperand: simplifiedLeftOperand.invert().simplify(),
        operator: this.operator,
        rightOperand: simplifiedRightOperand.invert().simplify(),
      })
        .simplify();
    }

    if ((isMultiplication || isDivision) && isLeftNegative) {
      return new UnaryExpression({
        operator: '-',
        operand: new BinaryExpression({
          leftOperand: simplifiedLeftOperand.invert().simplify(),
          operator: this.operator,
          rightOperand: simplifiedRightOperand,
        })
          .simplify(),
      });
    }

    if ((isMultiplication || isDivision) && isRightNegative) {
      return new UnaryExpression({
        operator: '-',
        operand: new BinaryExpression({
          leftOperand: simplifiedLeftOperand,
          operator: this.operator,
          rightOperand: simplifiedRightOperand.invert().simplify(),
        })
          .simplify(),
      });
    }

    if ((isMultiplication || isDivision) && isRightOne) {
      return simplifiedLeftOperand;
    }

    if (isMultiplication && isLeftOne) {
      return simplifiedRightOperand;
    }

    return new BinaryExpression({
      leftOperand: simplifiedLeftOperand,
      operator: this.operator,
      rightOperand: simplifiedRightOperand,
    });
  }

  serialize() {
    return `(${this.leftOperand.serialize()} ${this.operator} ${this.rightOperand.serialize()})`;
  }
}
