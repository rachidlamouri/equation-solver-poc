import _ from 'lodash';
import { BinaryExpression } from './binaryExpression.js';
import { ConstantExpression } from './constantExpression.js';
import { UnaryExpression } from './unaryExpression.js';
import { VariableExpression } from './variableExpression.js';

export const parseExpression = (expression) => {
  switch(true) {
    case _.isArray(expression) && expression.length === 2: return UnaryExpression.parse(expression);
    case _.isArray(expression) && expression.length === 3: return BinaryExpression.parse(expression);
    case _.isNumber(expression): return ConstantExpression.parse(expression);
    case _.isString(expression): return VariableExpression.parse(expression);
    default: throw Error(`Expected a 3 tuple, 2 tuple, number or string; received: ${typeof expression}`);
  }
}
