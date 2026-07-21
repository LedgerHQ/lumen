import { describe, it, expect } from 'vitest';
import { sanitizeAmount } from './sanitizeAmount';

describe('sanitizeAmount', () => {
  type Case = { name: string; input: string; expected: string };

  const cases: Case[] = [
    { name: 'strip letters', input: '12a3', expected: '123' },
    { name: 'strip symbols', input: '1@2#3$', expected: '123' },
    { name: 'strip currency and spaces', input: '€ 1 234', expected: '1234' },
    { name: 'convert comma to dot', input: '1,5', expected: '1.5' },
    { name: 'keep dot', input: '1.5', expected: '1.5' },
    { name: 'keep multiple dots', input: '1.2.3', expected: '1.2.3' },
    { name: 'mixed letters and digits', input: '1a2b.3c', expected: '12.3' },
    { name: 'empty stays empty', input: '', expected: '' },
    { name: 'no digits becomes empty', input: 'abc', expected: '' },
  ];

  it.each(cases)('$name', ({ input, expected }) => {
    expect(sanitizeAmount(input)).toBe(expected);
  });
});
