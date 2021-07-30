import _ from 'lodash';
import antlr4 from 'antlr4';
import Lexer from '../inputParser/compiled/mathLexer.js';
import Parser from '../inputParser/compiled/mathParser.js';
import { BinaryExpression } from './binaryExpression.js';
import { ConstantExpression } from './constantExpression.js';
import { UnaryExpression } from './unaryExpression.js';
import { VariableExpression } from './variableExpression.js';

class Visitor {
  visitChildren(context) {
    if (context.parenthesizedExpressionNode !== null) {
      return context.parenthesizedExpressionNode.accept(this);
    }

    const properties = _([
      ['leftExpressionNode', 'leftExpression', true],
      ['rightExpressionNode', 'rightExpression', true],
      ['unaryExpressionNode', 'expression', true],
      ['operatorNode', 'operator', false],
      ['variableNameNode', 'variableName', false],
      ['constantNode', 'constantValue', false],
    ])
      .map(([nodeName, parsedNodeName, isExpression]) => {

        const node = context[nodeName];
        if (!node) {
          return null;
        }

        return [
          parsedNodeName,
          isExpression
            ? node.accept(this)
            : node.text
        ];
      })
      .reject(_.isNull)
      .fromPairs()
      .value();

    const [,ExpressionClass] = [
      ['constantValue', ConstantExpression],
      ['variableName', VariableExpression],
      ['leftExpression', BinaryExpression],
      ['expression', UnaryExpression],
    ]
      .find(([propertyName]) => propertyName in properties);

    return new ExpressionClass({
      input: context.getText(),
      ...properties,
    });
  }
}

export const parseExpression = (equationString) => {
  const chars = new antlr4.InputStream(equationString);
  const lexer = new Lexer(chars);
  const tokens = new antlr4.CommonTokenStream(lexer);
  const parser = new Parser(tokens);
  parser.buildParseTrees = true;
  const tree = parser.input();

  const parsedExpression = tree.accept(new Visitor());
  return parsedExpression;
};
