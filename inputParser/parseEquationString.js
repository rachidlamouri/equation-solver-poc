import antlr4 from 'antlr4';
import Lexer from './compiled/mathLexer.js';
import Parser from './compiled/mathParser.js';
import MathListener from './compiled/mathListener.js';

class CustomListener extends MathListener {
  enterExpression(ctx) {
    console.log('ENTER EXPR', ctx.getText());

    console.log({
      leftExpression: ctx.leftExpressionNode && ctx.leftExpressionNode.getText(),
      operator: ctx.operatorNode && ctx.operatorNode.text,
      rightExpression: ctx.rightExpressionNode && ctx.rightExpressionNode.getText(),
      unaryExpression: ctx.unaryExpressionNode && ctx.unaryExpressionNode.getText(),
      parenthesizedExpression: ctx.parenthesizedNode && ctx.parenthesizedNode.getText(),
      variableName: ctx.variableNameNode && ctx.variableNameNode.text,
      constantNode: ctx.constantNode && ctx.constantNode.text,
    })
	}

	exitExpression(ctx) {
    console.log('EXIT EXPR', ctx.getText());
	}
}

export const parseEquationString = (equationString) => {
  const chars = new antlr4.InputStream(equationString);
  const lexer = new Lexer(chars);
  const tokens = new antlr4.CommonTokenStream(lexer);
  const parser = new Parser(tokens);
  parser.buildParseTrees = true;
  const tree = parser.input();
  antlr4.tree.ParseTreeWalker.DEFAULT.walk(new CustomListener(), tree)
};
