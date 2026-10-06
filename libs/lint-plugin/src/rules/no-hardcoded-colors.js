import { getPropertyName, getStaticString } from '../shared/ast.js';
import { isHardcodedColor } from '../shared/colors.js';

/** @import { AstNode } from '../shared/ast.js' */

const COLOR_PROPERTIES = new Set([
  'color',
  'backgroundColor',
  'borderColor',
  'borderTopColor',
  'borderRightColor',
  'borderBottomColor',
  'borderLeftColor',
  'borderStartColor',
  'borderEndColor',
  'borderBlockColor',
  'borderBlockStartColor',
  'borderBlockEndColor',
  'outlineColor',
  'textDecorationColor',
  'textShadowColor',
  'shadowColor',
  'tintColor',
  'overlayColor',
  'underlayColor',
  'selectionColor',
  'placeholderTextColor',
  'cursorColor',
  'caretColor',
  'fill',
  'stroke',
  'stopColor',
  'floodColor',
  'lightingColor',
]);

// Color-carrying JSX props: SVG presentation attributes and the React Native
// components whose color is a prop rather than a style entry.
const COLOR_ATTRIBUTES = new Set([
  'color',
  'fill',
  'stroke',
  'stopColor',
  'floodColor',
  'lightingColor',
  'tintColor',
  'thumbColor',
  'underlayColor',
  'selectionColor',
  'placeholderTextColor',
  'cursorColor',
]);

/** @type {import('eslint').Rule.RuleModule} */
export const noHardcodedColors = {
  meta: {
    type: 'problem',
    docs: {
      description:
        'Disallow hardcoded colors in style objects and color props; use design tokens.',
    },
    messages: {
      hardcodedColor:
        "Use a design token instead of the hardcoded color '{{value}}'.",
    },
    schema: [
      {
        type: 'object',
        properties: {
          allow: {
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
    const options = /** @type {{ allow?: string[] } | undefined} */ (
      context.options[0]
    );
    const allowed = new Set(
      (options?.allow ?? []).map((value) => value.trim().toLowerCase()),
    );

    /**
     * @param {AstNode} reportNode
     * @param {AstNode | null | undefined} valueNode
     */
    function check(reportNode, valueNode) {
      const value = getStaticString(valueNode);
      if (value === null) return;
      if (allowed.has(value.trim().toLowerCase())) return;
      if (!isHardcodedColor(value)) return;
      context.report({
        node: /** @type {any} */ (reportNode),
        messageId: 'hardcodedColor',
        data: { value },
      });
    }

    return {
      /** @param {AstNode} node */
      Property(node) {
        const name = getPropertyName(node);
        if (name !== null && COLOR_PROPERTIES.has(name)) {
          check(node.value, node.value);
        }
      },
      /** @param {AstNode} node */
      JSXAttribute(node) {
        if (
          node.name.type !== 'JSXIdentifier' ||
          !COLOR_ATTRIBUTES.has(node.name.name)
        ) {
          return;
        }
        const { value } = node;
        check(
          value,
          value?.type === 'JSXExpressionContainer' ? value.expression : value,
        );
      },
    };
  },
};
