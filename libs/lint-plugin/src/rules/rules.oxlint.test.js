import { RuleTester } from 'oxlint/plugins-dev';
import { describe, it } from 'vitest';

import { noHardcodedStyleLiteralsCases } from './no-hardcoded-style-literals.cases.js';
import { noHardcodedStyleLiterals } from './no-hardcoded-style-literals.js';

RuleTester.describe = describe;
RuleTester.it = it;
RuleTester.itOnly = it.only;

const tester = new RuleTester({
  languageOptions: { parserOptions: { lang: 'tsx' } },
});

// oxlint's tester types its own `Rule`; ours is the ESLint `RuleModule`.
const asOxlintRule = (/** @type {unknown} */ rule) => /** @type {any} */ (rule);

tester.run(
  'no-hardcoded-style-literals',
  asOxlintRule(noHardcodedStyleLiterals),
  noHardcodedStyleLiteralsCases,
);
