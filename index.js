import _ from 'lodash';
import { parseExpression } from './expressions/index.js';

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
  .mapValues((expression, key) => `${key} - (${expression})`)
  .mapValues((expression) => parseExpression(expression))
  .value();

console.log(JSON.stringify(inputs, null, 2));
