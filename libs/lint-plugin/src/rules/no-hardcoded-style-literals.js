import {
  getNumericValue,
  getPropertyName,
  getStaticString,
} from '../shared/ast.js';

/** @import { AstNode } from '../shared/ast.js' */

const SPACING_SIDES = [
  '',
  'Top',
  'Right',
  'Bottom',
  'Left',
  'Horizontal',
  'Vertical',
  'Start',
  'End',
];

const SIZE_PROPERTIES = new Set([
  'width',
  'height',
  'minWidth',
  'minHeight',
  'maxWidth',
  'maxHeight',
  'gap',
  'rowGap',
  'columnGap',
  'top',
  'right',
  'bottom',
  'left',
  'start',
  'end',
  'inset',
  ...SPACING_SIDES.flatMap((side) => [`margin${side}`, `padding${side}`]),
  'borderRadius',
  'borderTopLeftRadius',
  'borderTopRightRadius',
  'borderBottomLeftRadius',
  'borderBottomRightRadius',
  'borderTopStartRadius',
  'borderTopEndRadius',
  'borderBottomStartRadius',
  'borderBottomEndRadius',
]);

// `width`/`height` inside these are offsets, not layout sizes.
const OFFSET_PROPERTIES = new Set(['shadowOffset', 'textShadowOffset']);

const DIMENSION_STRING = /^-?(?:\d+\.?\d*|\.\d+)(?:px|%)?$/;

/**
 * @param {AstNode | null | undefined} callee
 * @returns {boolean} whether the callee is `useStyleSheet` or `StyleSheet.create`
 */
function isStyleFactory(callee) {
  if (!callee) return false;
  if (callee.type === 'Identifier') return callee.name === 'useStyleSheet';
  return (
    callee.type === 'MemberExpression' &&
    callee.object.type === 'Identifier' &&
    callee.object.name === 'StyleSheet' &&
    callee.property.type === 'Identifier' &&
    callee.property.name === 'create'
  );
}

/**
 * @param {AstNode} attribute a `JSXAttribute` node
 * @returns {boolean} whether the attribute is `style` or ends with `Style`
 */
function isStyleAttribute(attribute) {
  return (
    attribute.name.type === 'JSXIdentifier' &&
    (attribute.name.name === 'style' || attribute.name.name.endsWith('Style'))
  );
}

/**
 * @param {AstNode} property
 * @returns {boolean} whether the property sits inside a `shadowOffset`-like object
 */
function isInsideOffsetObject(property) {
  const owner = property.parent?.parent;
  if (owner?.type !== 'Property') return false;
  const name = getPropertyName(owner);
  return name !== null && OFFSET_PROPERTIES.has(name);
}

/**
 * @param {AstNode} valueNode
 * @returns {string | null} the offending literal as written, or null when the value is fine
 */
function getHardcodedDimension(valueNode) {
  const numeric = getNumericValue(valueNode);
  if (numeric !== null) {
    return Number.isFinite(numeric) && numeric !== 0 ? String(numeric) : null;
  }
  const text = getStaticString(valueNode)?.trim();
  if (text && DIMENSION_STRING.test(text) && Number.parseFloat(text) !== 0) {
    return `'${text}'`;
  }
  return null;
}

/** @type {import('eslint').Rule.RuleModule} */
export const noHardcodedStyleLiterals = {
  meta: {
    type: 'suggestion',
    docs: {
      description:
        'Disallow hardcoded size, spacing and radius numbers in React Native styles; use theme tokens.',
    },
    messages: {
      hardcodedLiteral:
        'Use a design token instead of the hardcoded {{property}} value {{value}}.',
    },
    schema: [
      {
        type: 'object',
        properties: {
          ignoreProperties: {
            type: 'array',
            items: { type: 'string' },
            uniqueItems: true,
          },
        },
        additionalProperties: false,
      },
    ],
  },
  create(context) {
    const options = /** @type {{ ignoreProperties?: string[] } | undefined} */ (
      context.options[0]
    );
    const ignored = new Set(options?.ignoreProperties ?? []);
    // Counts enclosing style contexts so only real style objects are checked.
    let styleDepth = 0;

    return {
      /** @param {AstNode} node */
      CallExpression(node) {
        if (isStyleFactory(node.callee)) styleDepth += 1;
      },
      /** @param {AstNode} node */
      'CallExpression:exit'(node) {
        if (isStyleFactory(node.callee)) styleDepth -= 1;
      },
      /** @param {AstNode} node */
      JSXAttribute(node) {
        if (isStyleAttribute(node)) styleDepth += 1;
      },
      /** @param {AstNode} node */
      'JSXAttribute:exit'(node) {
        if (isStyleAttribute(node)) styleDepth -= 1;
      },
      /** @param {AstNode} node */
      Property(node) {
        if (styleDepth === 0) return;
        const name = getPropertyName(node);
        if (name === null || !SIZE_PROPERTIES.has(name) || ignored.has(name)) {
          return;
        }
        if (isInsideOffsetObject(node)) return;
        const literal = getHardcodedDimension(node.value);
        if (literal === null) return;
        context.report({
          node: /** @type {any} */ (node.value),
          messageId: 'hardcodedLiteral',
          data: { property: name, value: literal },
        });
      },
    };
  },
};
