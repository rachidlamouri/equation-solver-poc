const _ = require('lodash');

/*
1: x = y
2: x = y + 1
3: x = y + z
4: x = y - z
5: x = y / z
6: x = 2y
7: x = yz
8: x = 3y + 2z
9: (a + b) + c
10: a + (b + c)
*/

['x', '=', 'y']

// equation
const inputs = {
  x1: ['y', '-', 'x'],
  x2: [['y', '+', 1], '-', 'x'],
  x3: [['y', '+', 'z'], '-', 'x'],
  x4: [['y', '-', 'z'], '-', 'x'],
  x5: [['y', '/', 'z'], '-', 'x'],
  x6: [[2, '*', 'y'], '-', 'x'],
  x7: [['y', '*', 'z'], '-', 'x'],
  x8: [[[3, '*', 'y'], '+', [2, '*', 'z']], '-', 'x'],
  x9: [[['a', '+', 'b'], '+', 'c'], '-', 'x'],
  x10: [['a', '+', ['b', '+', 'c']], '-', 'x'],
};

const parseExpression = (expression) => {
  switch(true) {
    case _.isArray(expression): return parseBinaryExpression(expression);
    case _.isNumber(expression): return parseConstant(expression);
    case _.isString(expression): return parseVariable(expression);
    default: throw Error(`Expected a 3 tuple, number or string; received: ${typeof expression}`);
  }
};

const parseBinaryExpression = (binaryExpression) => {
  if (binaryExpression.length !== 3) {
    throw Error('Expected an array with 3 elements: leftExpression, operator, rightExpression');
  }

  const [left, op, right] = binaryExpression;

  if (!['+', '-', '/', '*'].includes(op)) {
    throw Error(`Unexpected infix operator "${op}"`);
  }

  return {
    left: parseExpression(left),
    op,
    right: parseExpression(right),
  };
}

const parseConstant = (constant) => ({ const: constant });
const parseVariable = (variableName) => {
  if (!/^[a-zA-Z]+$/.test(variableName)) {
    throw Error(`Invalid variable name "${variableName}", must contain letters only`);
  }

  return { var: variableName, };
};


const parsedExpressions = _.mapValues(inputs, parseExpression);
console.log(JSON.stringify(parsedExpressions, null, 2));
