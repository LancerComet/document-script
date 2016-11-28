/// <reference path="../../index.d.ts" />

/*
 * Expression: Select.
 * By LancerComet at 14:22, 2016.11.27.
 * # Carry Your World #
 */

import { Keyword, isKeyword } from '../../parser'
import { Expression, EXPRESSION_LIST } from '../'
import { NumberLiteral, StringLiteral } from '../../parser'

import { errorHandler } from '../../utils'

const EXP_NAME = 'select'

/**
 * createExpression: select.
 * This function will be called in parser. 
 * 
 * @example
 *  select #my-div as myDiv
 * 
 * @export
 * @param {Token} currentToken
 * @param {Array<Token>} tokens
 * @param {AST} ast
 */
export function createExpression (currentToken: Token, tokens: Array<Token>, ast: AST) {
const selectExpression = new Expression(EXP_NAME)

  // Let's deal with the first arg.
  // The first arg is a element selector.
  // A selector can be anything, and will be converted to string-type.
  const selectorArg = tokens.shift()
  selectExpression.insertArg(new StringLiteral(selectorArg.value.toString()))

  // The second.
  // The second argument must be the keyword "as".
  const asArg = tokens.shift()
  asArg.value === 'as'
    ? selectExpression.insertArg(new Keyword(asArg.value))
    : errorHandler.typeError(`A keyword "as" must be provided after HTML tag name in "${EXP_NAME}" expression.`)

  // Last one.
  // The element variable, can be anything expect keyword and Expression.
  const elementVariableArg = tokens.shift()
  if (!isKeyword(elementVariableArg.value) && EXPRESSION_LIST.indexOf(elementVariableArg.value) < 0) {
    selectExpression.insertArg(
      elementVariableArg.type === 'number'
        ? new NumberLiteral(<number> elementVariableArg.value)
        : new StringLiteral(<string> elementVariableArg.value)
    )
  } else {
    errorHandler.typeError(`You can't use a keyword or expression as a variable when calling "${EXP_NAME}".`)
  }

  ast.insertExpression(selectExpression)

  // EOF.
}

export function run () {
  
}
