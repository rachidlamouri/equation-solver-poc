import _ from 'lodash';
import { Equation } from './equation.js';
import { parseExpression } from './expressions/index.js';
import { isolateVariables } from './isolateVariables.js';
import fs from 'fs';

const log = (label, data) => {
  console.log(label);
  console.log(JSON.stringify(data, null, 2));
  console.log();
};

_([
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
  .map((expression, index) => ({
    leftInput: 'x',
    rightInput: expression,
    serializedInput: `x = ${expression}`,
  }))
  .tap((allData) => {
    const inputEquations = _.map(allData, 'serializedInput');
    log('INPUT', inputEquations);
  })
  .map((data) => ({
    ...data,
    parsedEquation: new Equation({
      leftExpression: parseExpression(`${data.leftInput} - (${data.rightInput})`),
      rightExpression: parseExpression('0'),
    }),
  }))
  .tap((allData) => {
    const serializedEquations = Object.entries(allData).map(([, { parsedEquation }]) => parsedEquation.serialize());
    log('PARSED', serializedEquations);
  })
  .map((data) => ({
    ...data,
    solvedEquations: isolateVariables(data.parsedEquation),
  }))
  .tap((allData) => {
    const allSerializedSolvedEquations = (
      _(allData)
        .keyBy('serializedInput')
        .mapValues(({ solvedEquations }) => solvedEquations.map((equation) => equation.simplify().serialize()))
        .value()
    );

    log('SOLVED', allSerializedSolvedEquations);
    fs.writeFileSync('./out.json', JSON.stringify(allSerializedSolvedEquations, null, 2));
  })
  .value();
