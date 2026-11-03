import { describe, expect, it } from 'vitest';

import { buildAriaLabel } from './buildAriaLabel';
import type { FormattedValue } from './types';

const parts: FormattedValue = {
  integerPart: '1,234',
  decimalPart: '56',
  currencyText: '$',
  decimalSeparator: '.',
  currencyPosition: 'start',
};

describe('buildAriaLabel', () => {
  it('returns the hidden label when hidden', () => {
    expect(buildAriaLabel(parts, true, 'Amount hidden')).toBe('Amount hidden');
  });

  it('places the currency before the amount', () => {
    expect(buildAriaLabel(parts, false, 'Amount hidden')).toBe('$ 1,234.56');
  });

  it('places the currency after the amount', () => {
    expect(
      buildAriaLabel(
        {
          ...parts,
          integerPart: '1.234',
          decimalSeparator: ',',
          currencyText: 'EUR',
          currencyPosition: 'end',
        },
        false,
        'Amount hidden',
      ),
    ).toBe('1.234,56 EUR');
  });

  it.each([undefined, ''])(
    'omits the decimal separator when the decimal part is %j',
    (decimalPart) => {
      expect(buildAriaLabel({ ...parts, decimalPart }, false, '')).toBe(
        '$ 1,234',
      );
    },
  );
});
