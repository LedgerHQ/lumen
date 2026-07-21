import { describe, it, expect } from 'vitest';
import { parseAmount, type ParseAmountOptions } from './parseAmount';

describe('parseAmount', () => {
  type Case = {
    name: string;
    input: string;
    expected: string;
    options?: ParseAmountOptions;
  };

  const cases: Case[] = [
    { name: 'lone dot becomes 0.', input: '.', expected: '0.' },
    { name: 'prepend 0 to .5', input: '.5', expected: '0.5' },
    { name: 'strip leading zeros', input: '01', expected: '1' },
    { name: 'preserve single zero', input: '0', expected: '0' },
    { name: 'preserve trailing dot', input: '12.', expected: '12.' },
    { name: 'merge extra dots', input: '1.2.3', expected: '1.23' },
    { name: 'no grouping applied', input: '1234567', expected: '1234567' },
    { name: 'empty stays empty', input: '', expected: '' },
    {
      name: 'limit integer length',
      input: '123456789012',
      expected: '123456789',
    },
    {
      name: 'limit decimal length',
      input: '123.123456',
      expected: '123.12',
      options: { maxDecimalLength: 2 },
    },
    {
      name: 'integer-only mode drops decimals',
      input: '1.5',
      expected: '15',
      options: { allowDecimals: false },
    },
  ];

  it.each(cases)('$name', ({ input, expected, options }) => {
    expect(parseAmount(input, options)).toBe(expected);
  });
});
