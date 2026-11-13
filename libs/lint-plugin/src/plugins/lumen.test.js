import { RuleTester } from 'eslint';
import { describe, it } from 'vitest';

import lumen from './lumen.js';

RuleTester.describe = describe;
RuleTester.it = it;
RuleTester.itOnly = it.only;

const rule = /** @type {import('eslint').Rule.RuleModule} */ (
  lumen.rules?.['enforce-logical-properties']
);

/**
 * @param {string} code
 * @param {string | null} output
 * @param {number} errors
 */
const invalid = (code, output, errors = 1) => ({
  code,
  output,
  errors: Array(errors).fill({ messageId: 'physical' }),
});

new RuleTester().run('enforce-logical-properties', rule, {
  valid: [
    'const s = { marginStart: 4, top: 0, width: 10 };',
    'const s = { left: 0, right: 0 };',
    'const { marginLeft } = style;',
    'const s = { [marginLeft]: 4, marginRight, left() {} };',
    'const s = { toString: f, constructor: C };',
  ],
  invalid: [
    invalid(
      'const s = { marginLeft: 4, borderTopRightRadius: 2 };',
      'const s = { marginStart: 4, borderTopEndRadius: 2 };',
      2,
    ),
    invalid('const s = { left: 8 };', 'const s = { start: 8 };'),
    invalid('const s = { right: 8 };', 'const s = { end: 8 };'),
    invalid('const s = { marginStart: 2, marginLeft: 4 };', null),
  ],
});
