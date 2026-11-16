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

// React Native's `Insets` props take physical edges only: `start`/`end`
// there would be dropped, so their objects are not styles to rewrite.
const INSETS_PROPS = new Set([
  'hitSlop',
  'pressRetentionOffset',
  'contentInset',
  'scrollIndicatorInsets',
]);

// ESTree's types stop short of JSX.
/** @typedef {{ type: string, name?: unknown, parent?: LooseNode }} LooseNode */

/**
 * @param {Rule.Node} node
 * @returns {boolean}
 */
const isInsetsProp = (node) => {
  const container = /** @type {LooseNode} */ (node).parent;
  const attribute = container?.parent;
  const name = /** @type {LooseNode | undefined} */ (attribute?.name);
  return (
    container?.type === 'JSXExpressionContainer' &&
    attribute?.type === 'JSXAttribute' &&
    name?.type === 'JSXIdentifier' &&
    INSETS_PROPS.has(String(name.name))
  );
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
      if (isInsetsProp(node)) return;
      /** @type {Map<string, Property>} */
      const keys = new Map();
      for (const p of node.properties) {
        if (
          p.type === 'Property' &&
          p.key.type === 'Identifier' &&
          !p.computed &&
          !p.shorthand &&
          !p.method
        ) {
          keys.set(p.key.name, p);
        }
      }
      // `left` with `right` spans edge to edge, the same in both directions.
      const insets = new Map(
        keys.has('left') && keys.has('right')
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
          fix: keys.has(logical)
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
