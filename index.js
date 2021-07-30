import _ from 'lodash';
import { Equation } from './equation.js';
import { parseExpression } from './expressions/index.js';

const log = (label, data) => {
  console.log(label);
  console.log(JSON.stringify(data, null, 2));
  console.log();
};

const inputs = _([
  // single value
  '1',
  'a',

  // explicit positive
  '+1',
  '+a',

  // negative
  '-1',
  '-a',

  // addition
  '1 + 2',
  'a + 2',
  'a + b',
  '1 + b',

  // subtraction
  '1 - 2',
  'a - 2',
  'a - b',
  '1 - b',

  // multiplication
  '1 * 2',
  'a * 2',
  'a * b',
  '1 * b',

  // division
  '1 / 2',
  'a / 2',
  'a / b',
  '1 / b',

  // order of operations
  'a + b * c + (d - e) + f / g',
])
  .map((expression, index) => [`x${index}`, expression])
  .fromPairs()
  .tap((input) => {
    log('INPUT', input);
  })
  .mapValues((expression, key) => `${key} - (${expression})`)
  .mapValues((expression) => parseExpression(expression))
  .mapValues((parsedExpression) => new Equation({
    leftExpression: parsedExpression,
    rightExpression: parseExpression('0'),
  }))
  .tap((equations) => {
    const serializedEquations = Object.entries(equations).map(([, equation]) => equation.serialize());
    log('PARSED', serializedEquations);
  })
  .value();

console.log(JSON.stringify(inputs, null, 2));
