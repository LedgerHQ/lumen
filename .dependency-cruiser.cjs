/**
 * Intra-lib layering for the published libs. Inter-lib rules live in Nx
 * (`@nx/enforce-module-boundaries`, see eslint.config.mjs); this file only
 * guards paths inside a lib. Run: `npm run check:layers`.
 *
 * Layer order inside `src/lib/Components` (a layer may import the ones below):
 *   visualization, core -> internal -> primitives / animations (RN) / symbols -> utils
 * `internal` Bases only stay clear of the core components built on them.
 * Tests, stories, Code Connect and docs are not cruised: they legitimately
 * reach across layers (e.g. a `ThemeProvider` wrapper).
 */

const UI_LIBS = ['ui-react', 'ui-rnative'];

// Core components built on each internal Base; a Base may not import them back.
const BASE_FAMILIES = {
  BaseButton: ['Button', 'IconButton', 'MediaButton'],
  BaseInput: ['AddressInput', 'SearchInput', 'TextInput'],
  BaseTag: ['MediaTag', 'Tag'],
};
const components = (lib) => `^libs/${lib}/src/lib/Components`;
const layer = (lib, name) => `${components(lib)}/${name}/`;

/** @type {import('dependency-cruiser').IForbiddenRuleType[]} */
const layerRules = UI_LIBS.flatMap((lib) => {
  const forbid = (name, from, to, comment) => ({
    name: `${lib}-${name}`,
    severity: 'error',
    comment,
    from: { path: from },
    to: { path: to },
  });
  const upper = (...names) => names.map((n) => layer(lib, n)).join('|');

  return [
    ...Object.entries(BASE_FAMILIES).map(([base, derived]) =>
      forbid(
        `${base}-not-to-derived`,
        `${layer(lib, 'internal')}${base}/`,
        `${components(lib)}/core/(${derived.join('|')})/`,
        `${base} must not import the components built on it (${derived.join(', ')}).`,
      ),
    ),
    forbid(
      'foundations-not-to-upper-layers',
      `${layer(lib, 'symbols')}|${layer(lib, 'primitives')}|${layer(lib, 'animations')}`,
      upper('core', 'internal', 'visualization'),
      'symbols, primitives and animations are the lowest component layers.',
    ),
    forbid(
      'visualization-subpath-only',
      [
        upper('core', 'internal', 'symbols', 'primitives', 'animations'),
        `^libs/${lib}/src/index\\.ts$`,
        `${components(lib)}/index\\.ts$`,
      ].join('|'),
      layer(lib, 'visualization'),
      'visualization is imported only via its own /visualization subpath.',
    ),
    forbid(
      'utils-not-to-components',
      `^libs/${lib}/src/(lib/)?utils/`,
      components(lib),
      'utils are framework helpers; they must not depend on components.',
    ),
  ];
});

/** @type {import('dependency-cruiser').IConfiguration} */
module.exports = {
  forbidden: [
    ...layerRules,
    {
      name: 'ui-react-not-to-ui-rnative',
      severity: 'error',
      from: { path: '^libs/ui-react/src' },
      to: { path: '^libs/ui-rnative/src' },
    },
    {
      name: 'ui-rnative-not-to-ui-react',
      severity: 'error',
      from: { path: '^libs/ui-rnative/src' },
      to: { path: '^libs/ui-react/src' },
    },
    {
      name: 'shared-libs-not-to-ui',
      severity: 'error',
      comment: 'design-core and utils-shared sit below the UI libs.',
      from: { path: '^libs/(design-core|utils-shared)/src' },
      to: { path: '^libs/ui-(react|rnative)/' },
    },
    {
      name: 'utils-shared-not-to-design-core',
      severity: 'error',
      from: { path: '^libs/utils-shared/src' },
      to: { path: '^libs/design-core/' },
    },
    {
      name: 'no-circular',
      severity: 'error',
      from: {},
      to: { circular: true },
    },
  ],
  options: {
    doNotFollow: { path: 'node_modules' },
    exclude: {
      path: [
        '\\.(test|stories|figma|performance\\.test)\\.[cm]?[jt]sx?$',
        '\\.mdx$',
        '^libs/[^/]+/(dist|types)/',
        '(^|/)\\.storybook/',
      ],
    },
    tsPreCompilationDeps: true,
    tsConfig: { fileName: 'tsconfig.base.json' },
    enhancedResolveOptions: {
      exportsFields: ['exports'],
      conditionNames: [
        '@ledgerhq/lumen-source',
        'import',
        'require',
        'node',
        'default',
        'types',
      ],
      mainFields: ['module', 'main', 'types'],
    },
    reporterOptions: { text: { highlightFocused: true } },
  },
};
