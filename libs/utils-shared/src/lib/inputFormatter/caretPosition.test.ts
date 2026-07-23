import { describe, it, expect } from 'vitest';
import { getSignificantCaretPosition } from './caretPosition';

describe('getSignificantCaretPosition', () => {
  type Case = {
    name: string;
    rawValue: string;
    caret: number;
    formattedValue: string;
    expected: number;
  };

  const cases: Case[] = [
    {
      name: 'anchors after the same digits when a separator is inserted',
      rawValue: '1234',
      caret: 2,
      formattedValue: '1 234',
      expected: 3,
    },
    {
      name: 'keeps position when deleting a digit shifts grouping',
      rawValue: '12345',
      caret: 3,
      formattedValue: '12 345',
      expected: 4,
    },
    {
      name: 'caret at start stays at start',
      rawValue: '1234',
      caret: 0,
      formattedValue: '1 234',
      expected: 0,
    },
    {
      name: 'caret at end lands at end',
      rawValue: '1234',
      caret: 4,
      formattedValue: '1 234',
      expected: 5,
    },
    {
      name: 'counts the decimal separator as significant',
      rawValue: '1234.5',
      caret: 6,
      formattedValue: '1 234.5',
      expected: 7,
    },
    {
      name: 'ignores leading non-significant chars in the raw slice',
      rawValue: '€ 1234',
      caret: 4,
      formattedValue: '1 234',
      expected: 3,
    },
    {
      name: 'clamps to the end when target exceeds formatted digits',
      rawValue: '1234',
      caret: 4,
      formattedValue: '123',
      expected: 3,
    },
    {
      name: 'empty formatted value returns 0',
      rawValue: '1',
      caret: 1,
      formattedValue: '',
      expected: 0,
    },
  ];

  it.each(cases)('$name', ({ rawValue, caret, formattedValue, expected }) => {
    expect(getSignificantCaretPosition(rawValue, caret, formattedValue)).toBe(
      expected,
    );
  });
});
