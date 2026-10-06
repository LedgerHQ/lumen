import { RuleTester } from 'eslint';
import tseslint from 'typescript-eslint';
import { afterAll, describe, it } from 'vitest';

import { noHardcodedStyleLiteralsCases } from './no-hardcoded-style-literals.cases.js';
import { noHardcodedStyleLiterals } from './no-hardcoded-style-literals.js';

// `afterAll` is supported at runtime but missing from ESLint's typings.
/** @type {any} */ (RuleTester).afterAll = afterAll;
RuleTester.describe = describe;
RuleTester.it = it;
RuleTester.itOnly = it.only;

const tester = new RuleTester({
  languageOptions: {
    parser: tseslint.parser,
    parserOptions: { ecmaFeatures: { jsx: true } },
  },
});

tester.run(
  'no-hardcoded-style-literals',
  noHardcodedStyleLiterals,
  noHardcodedStyleLiteralsCases,
);
