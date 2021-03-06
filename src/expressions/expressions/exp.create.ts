/// <reference path="../../index.d.ts" />

/*
 * Expression: append.
 * By LancerComet at 0:04, 2016.11.27.
 * # Carry Your World #
 */

import { Keyword, isKeyword } from '../../parser'
import { Expression, EXPRESSION_LIST, Variable } from '../'
import { NumberLiteral, StringLiteral } from '../../parser'

import { VARIABLE_HASH, TEMP_VARIABLE_HASH } from '../../transformer'

import { errorHandler } from '../../utils'

const EXP_NAME = 'create'

/**
 * createExpression: create.
 * This function will be called in parser. 
 * 
 * @example
 *  create div as myDiv
 *  create canvas as myCanvas
 * 
 * @export
 * @param {Token} currentToken
 * @param {Array<Token>} tokens
 * @param {AST} ast
 */
export function createExpression (currentToken: Token, tokens: Array<Token>, ast: AST) {
  const createExpression = new Expression(EXP_NAME)

  // Let's deal with the first arg.
  // The first arg is a HTML tag name.
  // A tag name can be anything expect number.
  const tagNameArg = tokens.shift()
  tagNameArg.type === 'word'
    ? createExpression.insertArg(new StringLiteral(tagNameArg.value))
    : errorHandler.typeError('A HTML tag name can\'t be a number.')

  // The second.
  // The second argument must be the keyword "as".
  const asArg = tokens.shift()
  asArg.value === 'as'
    ? createExpression.insertArg(new Keyword(asArg.value))
    : errorHandler.typeError(`A keyword "as" must be provided after HTML tag name in "${EXP_NAME}" expression.`)

  // Last one.
  // The element variable, can be anything expect keyword and Expression.
  const elementVariableArg = tokens.shift()
  if (!isKeyword(elementVariableArg.value) && EXPRESSION_LIST.indexOf(elementVariableArg.value) < 0) {
    createExpression.insertArg(
      elementVariableArg.type === 'number'
        ? new NumberLiteral(<number> elementVariableArg.value)
        : new StringLiteral(<string> elementVariableArg.value)
    )
  } else {
    errorHandler.typeError(`You can't use a keyword or expression as a variable when calling "${EXP_NAME}".`)
  }

  ast.insertExpression(createExpression)
  
  // EOF.
}

/**
 * Run create expression.
 * 
 * @export
 * @param {Expression} expression
 */
export function run (expression: Expression) {
  // Get tagName.
  const tagName = expression.arguments.shift()
  if (tagName.type !== 'StringLiteral' || typeof tagName.value !== 'string') {
    errorHandler.typeError('You must use a string as your tag name.')
  }

  // Check keyword as.
  const asKeyword = expression.arguments.shift()
  if (asKeyword.type !== 'keyword' || asKeyword.value !== 'as') {
    errorHandler.syntaxError('"as" must be followed after "${tagName}" in "create" expression.')
  }

  // Set variable.
  const variableName = expression.arguments.shift().value
  const variableValue = document.createElement(<string> tagName.value)

  // Create new variable.
  expFunc(variableName, new Variable(variableName, variableValue))
}

/**
 * Function of create expression.
 * 
 * @export
 * @param {(string | number)} variableName
 * @param {Variable} newVarialbe
 */
export function expFunc (variableName: string | number, newVarialbe: Variable) {
  VARIABLE_HASH[variableName] = newVarialbe  
}
