import _ from 'lodash';
import { parseExpression } from './expressions/index.js';

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
11: x = -y
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
  x11: [['-', 'y'], '-', 'x'],
};

console.log('Expressions');
const parsedExpressions = _.mapValues(inputs, parseExpression);
console.log(JSON.stringify(parsedExpressions, null, 2));
