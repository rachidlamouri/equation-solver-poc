import _ from 'lodash';
import { parseExpression } from './expressions/index.js';
import { isolateVariables } from './isolateVariables.js';

const inputs = {
  'x = y': ['x', '-', 'y'],
  'x = -y': ['x', '+', 'y'],
  'x = y + 1': ['x', '-', ['y', '+', 1]],
  'x = y + z': ['x', '-', ['y', '+', 'z']],
  'x = y - z': ['x', '-', ['y', '-', 'z']],
  'x = y / z': ['x', '-', ['y', '/', 'z']],

  'x = 2y': ['x', '-', [2, '*', 'y']],
  'x = yz': ['x', '-', ['y', '*', 'z']],
  'x = 3y + 2z': ['x', '-', [[3, '*', 'y'], '+', [2, '*', 'z']]],
  'x = (a + b) + c': ['x', '-', [['a', '+', 'b'], '+', 'c']],
  'x = a + (b + c)': ['x', '-', ['a', '+', ['b', '+', 'c']]],
};

console.log('Parsed Expressions');
const parsedExpressions = _.mapValues(inputs, parseExpression);
console.log(JSON.stringify(parsedExpressions, null, 2));

console.log('Equations');
const parsedEquations = _.mapValues(parsedExpressions, isolateVariables);

console.log('Serialized')
const serialized = _.mapValues(parsedEquations, (equations) => equations.map((equation) => equation.serialize()));
console.log(JSON.stringify(serialized, null, 2));

console.log('Simplified Serialized')
const simplified = _.mapValues(parsedEquations, (equations) => equations.map((equation) => equation.simplify()))
const simplifiedSerialized = _.mapValues(simplified, (equations) => equations.map((equation) => equation.serialize()));
console.log(JSON.stringify(simplifiedSerialized, null, 2));
