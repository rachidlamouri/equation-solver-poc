import { Equation } from './equation.js';
import {
  BinaryExpression,
  ConstantExpression,
  UnaryExpression,
  VariableExpression,
} from './expressions/index.js';

const parseEquations = (equations, parsedEquations = [], iteration = 0) => {
  console.log(iteration);
  console.log('EQS', JSON.stringify(equations, null, 2));
  console.log('PEQS', JSON.stringify(parsedEquations, null, 2));
  if (equations.length === 0) {
    return parsedEquations;
  }

  const nextEquations = [];
  equations.forEach((equation) => {
    console.log('EQ', JSON.stringify(equation, null, 2));
    const { leftExpression } = equation;

    switch(true) {
      case leftExpression instanceof ConstantExpression: {
        return;
      }
      case leftExpression instanceof VariableExpression: {
        parsedEquations.push(equation);
        return;
      }
      case leftExpression instanceof UnaryExpression: {
        nextEquations.push(UnaryExpression.split(equation));
        return;
      }
      case leftExpression instanceof BinaryExpression: {
        nextEquations.push(...BinaryExpression.split(equation));
        return;
      }
      default: throw Error(`Unhandled expression type "${leftExpression.constructor.name}"`);
    }
  });

  return parseEquations(
    nextEquations,
    parsedEquations,
    iteration += 1
  )
};

export const isolateVariables = (parsedExpression) => {
  const equation = new Equation({
    leftExpression: parsedExpression,
    rightExpression: ConstantExpression.parse(0),
  });

  return parseEquations([equation]);
};
