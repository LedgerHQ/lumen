/**
 * The rules run on ESTree (ESLint), typescript-estree and oxlint's
 * ESTree-compatible AST, so they only rely on `type` and the fields they read.
 * @typedef {{ type: string, [key: string]: any }} AstNode
 */

const EXPRESSION_WRAPPERS = new Set([
  'TSAsExpression',
  'TSSatisfiesExpression',
  'TSNonNullExpression',
  'TSTypeAssertion',
  'ParenthesizedExpression',
]);

/**
 * Strips TypeScript and parenthesis wrappers (`'#fff' as const`, `8!`).
 * @param {AstNode | null | undefined} node
 * @returns {AstNode | null}
 */
export function unwrapExpression(node) {
  let current = node ?? null;
  while (current && EXPRESSION_WRAPPERS.has(current.type)) {
    current = current.expression;
  }
  return current;
}

/**
 * @param {AstNode | null | undefined} node
 * @returns {string | null} the value of a string literal or an expression-less template literal
 */
export function getStaticString(node) {
  const expression = unwrapExpression(node);
  if (!expression) return null;
  if (expression.type === 'Literal' && typeof expression.value === 'string') {
    return expression.value;
  }
  if (
    expression.type === 'TemplateLiteral' &&
    expression.expressions.length === 0
  ) {
    return expression.quasis[0].value.cooked ?? null;
  }
  return null;
}

/**
 * @param {AstNode | null | undefined} node
 * @returns {number | null} the value of a (signed) numeric literal
 */
export function getNumericValue(node) {
  const expression = unwrapExpression(node);
  if (!expression) return null;
  if (expression.type === 'Literal' && typeof expression.value === 'number') {
    return expression.value;
  }
  if (
    expression.type === 'UnaryExpression' &&
    (expression.operator === '-' || expression.operator === '+')
  ) {
    const operand = getNumericValue(expression.argument);
    if (operand === null) return null;
    return expression.operator === '-' ? -operand : operand;
  }
  return null;
}

/**
 * @param {AstNode} property an object `Property` node
 * @returns {string | null} the statically known key, or null for computed keys
 */
export function getPropertyName(property) {
  if (property.computed) return null;
  const { key } = property;
  if (key.type === 'Identifier') return key.name;
  if (key.type === 'Literal' && typeof key.value === 'string') return key.value;
  return null;
}
