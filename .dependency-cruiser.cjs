/**
 * Intra-lib layering for the published libs. Inter-lib rules live in Nx
 * (`@nx/enforce-module-boundaries`, see eslint.config.mjs); this file only
 * guards paths inside a lib. Run: `npm run check:layers`.
 *
 * Layer order inside `src/lib/Components` (a layer may import the ones below):
 *   visualization, core -> internal -> primitives / animations (RN) / symbols -> utils
 * `internal` may import `core` only for Spinner and InteractiveIcon.
 * Tests, stories, Code Connect and docs are not cruised: they legitimately
 * reach across layers (e.g. a `ThemeProvider` wrapper).
 */

const UI = '^libs/ui-(react|rnative)/src';
const C = `${UI}/lib/Components`;

/** @type {import('dependency-cruiser').IConfiguration} */
module.exports = {
  forbidden: [
    {
      name: 'internal-not-to-core',
      severity: 'error',
      comment:
        'internal Bases must not import the core components built on them. Spinner and InteractiveIcon are leaf pieces that BaseButton and BaseInput render.',
      from: { path: `${C}/internal/` },
      to: {
        path: `${C}/core/`,
        pathNot: `${C}/core/(Spinner|InteractiveIcon)/`,
      },
    },
    {
      name: 'foundations-not-to-upper-layers',
      severity: 'error',
      comment:
        'symbols, primitives and animations are the lowest component layers.',
      from: { path: `${C}/(symbols|primitives|animations)/` },
      to: { path: `${C}/(core|internal|visualization)/` },
    },
    {
      name: 'visualization-subpath-only',
      severity: 'error',
      comment:
        'visualization is imported only via its own /visualization subpath.',
      from: { path: UI, pathNot: `${C}/visualization/` },
      to: { path: `${C}/visualization/` },
    },
    {
      name: 'utils-not-to-components',
      severity: 'error',
      comment:
        'utils are framework helpers; they must not depend on components.',
      from: { path: `${UI}/(lib/)?utils/` },
      to: { path: `${C}/` },
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
