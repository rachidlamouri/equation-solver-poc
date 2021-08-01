import {
  BinaryExpression,
  ConstantExpression,
  UnaryExpression,
  VariableExpression,
} from './expressions/index.js';
import { EquationSystem } from './equationSystem.js';

const parseEquations = (equations, parsedEquations = []) => {
  if (equations.length === 0) {
    return parsedEquations;
  }

  const nextEquations = [];
  equations.forEach((equation) => {
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
  )
};

export const isolateVariables = (equation) => new EquationSystem(parseEquations([equation]));
