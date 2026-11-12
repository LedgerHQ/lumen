import { prodConfig } from '../../eslint.config.mjs';
import { defineDependencyChecks } from '../../eslint.shared.mjs';

export default [
  ...prodConfig,
  // tailwindcss is an optional peer for the CSS theme in tailwind/*.css, which
  // no TypeScript file imports, so the check would call it unused.
  defineDependencyChecks({ ignoredDependencies: ['tailwindcss'] }),
];
