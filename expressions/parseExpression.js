import _ from 'lodash';
import antlr4 from 'antlr4';
import Lexer from '../inputParser/compiled/mathLexer.js';
import Parser from '../inputParser/compiled/mathParser.js';

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
      ['unaryExpression','unaryExpression'],
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
