/** @import { ESLint, Rule } from 'eslint' */
/** @import { Property } from 'estree' */

const LOGICAL_KEYS = new Map(
  Object.entries({
    marginLeft: 'marginStart',
    marginRight: 'marginEnd',
    paddingLeft: 'paddingStart',
    paddingRight: 'paddingEnd',
    borderLeftWidth: 'borderStartWidth',
    borderRightWidth: 'borderEndWidth',
    borderLeftColor: 'borderStartColor',
    borderRightColor: 'borderEndColor',
    borderTopLeftRadius: 'borderTopStartRadius',
    borderTopRightRadius: 'borderTopEndRadius',
    borderBottomLeftRadius: 'borderBottomStartRadius',
    borderBottomRightRadius: 'borderBottomEndRadius',
  }),
);

// React Native's `Insets` (`hitSlop`, `contentInset`, safe-area `insets`, ...)
// take physical edges only: `start`/`end` there would be dropped, so objects
// named like one are not styles to rewrite.
const INSETS_NAME = /(?:hitSlop|insets?|retentionOffset)$/i;

// Expressions an object can sit in and still be the value being named.
const PASS_THROUGH = new Set([
  'JSXExpressionContainer',
  'TSAsExpression',
  'TSSatisfiesExpression',
  'LogicalExpression',
  'ConditionalExpression',
]);

// ESTree's types stop short of JSX and TypeScript.
/** @typedef {{ type: string, name?: unknown, key?: LooseNode, id?: LooseNode, value?: unknown, computed?: boolean, parent?: LooseNode }} LooseNode */

/**
 * @param {LooseNode | undefined} node
 * @returns {string | undefined}
 */
const staticName = (node) => {
  if (node?.type === 'Identifier' || node?.type === 'JSXIdentifier') {
    return String(node.name);
  }
  if (node?.type === 'Literal' && typeof node.value === 'string') {
    return node.value;
  }
  return undefined;
};

/**
 * Whether the object is the value of a JSX prop, property or variable named
 * like an `Insets`.
 * @param {Rule.Node} node
 * @returns {boolean}
 */
const isInsets = (node) => {
  let child = /** @type {LooseNode} */ (node);
  let parent = child.parent;
  while (parent && PASS_THROUGH.has(parent.type)) {
    child = parent;
    parent = parent.parent;
  }
  const name =
    parent?.type === 'JSXAttribute'
      ? staticName(/** @type {LooseNode} */ (parent.name))
      : parent?.type === 'Property' &&
          parent.value === child &&
          !parent.computed
        ? staticName(parent.key)
        : parent?.type === 'VariableDeclarator'
          ? staticName(parent.id)
          : undefined;
  return name !== undefined && INSETS_NAME.test(name);
};

/** @type {Rule.RuleModule} */
const enforceLogicalProperties = {
  meta: {
    type: 'suggestion',
    fixable: 'code',
    docs: {
      url: 'https://github.com/LedgerHQ/lumen/blob/main/libs/lint-plugin/README.md#react-native',
    },
    messages: {
      physical:
        '"{{physical}}" stays on the same side in right-to-left locales: use "{{logical}}".',
    },
    schema: [],
  },
  create: (context) => ({
    ObjectExpression(node) {
      if (isInsets(node)) return;
      // Every statically named key, shorthand or quoted ones included, so a
      // fix never collides with a logical key already there.
      const names = new Set();
      /** @type {Map<string, Property>} */
      const keys = new Map();
      for (const p of node.properties) {
        if (p.type !== 'Property' || p.computed) continue;
        const name = staticName(/** @type {LooseNode} */ (p.key));
        if (name === undefined) continue;
        names.add(name);
        if (p.key.type === 'Identifier' && !p.shorthand && !p.method) {
          keys.set(name, p);
        }
      }
      // `left` with `right` spans edge to edge, the same in both directions.
      const insets = new Map(
        names.has('left') && names.has('right')
          ? []
          : [
              ['left', 'start'],
              ['right', 'end'],
            ],
      );

      for (const [physical, { key }] of keys) {
        const logical = LOGICAL_KEYS.get(physical) ?? insets.get(physical);
        if (!logical) continue;
        context.report({
          node: key,
          messageId: 'physical',
          data: { physical, logical },
          fix: names.has(logical)
            ? null
            : (fixer) => fixer.replaceText(key, logical),
        });
      }
    },
  }),
};

/** @type {ESLint.Plugin} */
const plugin = {
  meta: { name: 'lumen' },
  rules: { 'enforce-logical-properties': enforceLogicalProperties },
};

// eslint-disable-next-line import/no-default-export
export default plugin;
