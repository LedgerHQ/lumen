import { describe, it, expect } from 'vitest';
import {
  formatAmount,
  createAmountParser,
  createAmountFormatter,
} from './formatAmount';

describe('formatAmount', () => {
  type Case = {
    name: string;
    input: string;
    expected: string;
    options?: Parameters<typeof formatAmount>[1];
  };

  const cases: Case[] = [
    { name: 'group thousands', input: '1234.5', expected: '1 234.5' },
    {
      name: 'comma decimal separator',
      input: '1234.5',
      expected: '1 234,5',
      options: { decimalSeparator: ',' },
    },
    {
      name: 'no thousands separator',
      input: '1234.5',
      expected: '1234.5',
      options: { thousandsSeparator: false },
    },
    { name: 'preserve trailing dot', input: '1234.', expected: '1 234.' },
    { name: 'empty stays empty', input: '', expected: '' },
  ];

  it.each(cases)('$name', ({ input, expected, options }) => {
    expect(formatAmount(input, options)).toBe(expected);
  });
});

describe('createAmountParser', () => {
  it('binds options', () => {
    const parse = createAmountParser({ maxDecimalLength: 2 });
    expect(parse('12.3456')).toBe('12.34');
  });
});

describe('createAmountFormatter', () => {
  it('binds options', () => {
    const format = createAmountFormatter({ decimalSeparator: ',' });
    expect(format('1234.5')).toBe('1 234,5');
  });
});
