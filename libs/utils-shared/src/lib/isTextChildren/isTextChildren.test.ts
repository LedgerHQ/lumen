import type { ReactNode } from 'react';
import React from 'react';
import { describe, it, expect } from 'vitest';
import { isTextChildren } from './isTextChildren';

describe('isAllowedTextChildren', () => {
  type Case = { name: string; input: unknown; expected: boolean };

  const cases: Case[] = [
    { name: 'string', input: 'hello', expected: true },
    { name: 'empty string', input: '', expected: true },
    { name: 'number', input: 42, expected: true },
    { name: 'zero', input: 0, expected: true },
    { name: 'NaN', input: Number.NaN, expected: true },
    { name: 'array of strings', input: ['a', 'b'], expected: true },
    {
      name: 'React element',
      input: React.createElement('View', null),
      expected: false,
    },
    { name: 'null', input: null, expected: false },
    { name: 'undefined', input: undefined, expected: false },
    { name: 'array of object and string', input: [{}, 'b'], expected: false },
    { name: 'boolean true', input: true, expected: false },
    { name: 'boolean false', input: false, expected: false },
    { name: 'object', input: { a: 1 }, expected: false },
    { name: 'function', input: () => 'x', expected: false },
    { name: 'symbol', input: Symbol('s'), expected: false },
  ];

  it.each(cases)('$name', ({ input, expected }) => {
    expect(isTextChildren(input as ReactNode)).toBe(expected);
  });
});
