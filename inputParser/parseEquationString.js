import _ from 'lodash';
import antlr4 from 'antlr4';
import Lexer from './compiled/mathLexer.js';
import Parser from './compiled/mathParser.js';

class Visitor {
  visitChildren(context) {
    const properties = _([
      ['parenthesizedExpressionNode', true],
      ['leftExpressionNode', true],
      ['rightExpressionNode', true],
      ['unaryExpressionNode', true],
      ['operatorNode', false],
      ['variableNameNode', false],
      ['constantNode', false],
    ])
      .map(([nodeName, isExpression]) => {
        const parsedNodeName = nodeName.replace(/Node/, '');

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

    const [,type] = [
      ['constant','constant'],
      ['variableName','variableName'],
      ['leftExpression','binaryExpression'],
      ['unaryExpresesionNode','unaryExpression'],
      ['parenthesizedExpression','parenthesizedExpression'],
    ]
      .find(([propertyName]) => propertyName in properties);

    return {
      type,
      input: context.getText(),
      ...properties,
    };
  }
}

export const parseEquationString = (equationString) => {
  const chars = new antlr4.InputStream(equationString);
  const lexer = new Lexer(chars);
  const tokens = new antlr4.CommonTokenStream(lexer);
  const parser = new Parser(tokens);
  parser.buildParseTrees = true;
  const tree = parser.input();

  const parsedExpression = tree.accept(new Visitor());
  return parsedExpression;
};
