import { describe, it, expect } from 'vitest';
import { textFormatter, type TextFormatterOptions } from './textFormatter.js';

describe('textFormatter', () => {
  describe('decimal handling with allowDecimals=true (default)', () => {
    type Case = { name: string; input: string; expected: string };

    const decimalCases: Case[] = [
      { name: 'convert single dot to "0."', input: '.', expected: '0.' },
      { name: 'prepend 0 to .5', input: '.5', expected: '0.5' },
      { name: 'prepend 0 to .123', input: '.123', expected: '0.123' },
      { name: 'allow 1.5', input: '1.5', expected: '1.5' },
      { name: 'allow 123.456', input: '123.456', expected: '123.456' },
      { name: 'allow 0.5', input: '0.5', expected: '0.5' },
      {
        name: 'limit to 9 decimal places (1.1234567899)',
        input: '1.1234567899',
        expected: '1.123456789',
      },
      {
        name: 'limit to 9 decimal places (0.123456789012345)',
        input: '0.123456789012345',
        expected: '0.123456789',
      },
    ];

    it.each(decimalCases)('$name', ({ input, expected }) => {
      expect(textFormatter(input)).toBe(expected);
    });

    const multipleDecimalCases: Case[] = [
      {
        name: 'remove multiple decimal points (1.2.3)',
        input: '1.2.3',
        expected: '1.23',
      },
      {
        name: 'remove multiple decimal points (1.2.3.4)',
        input: '1.2.3.4',
        expected: '1.234',
      },
      { name: 'handle triple dots', input: '...', expected: '0.' },
      { name: 'handle 1..2', input: '1..2', expected: '1.2' },
    ];

    it.each(multipleDecimalCases)('$name', ({ input, expected }) => {
      expect(textFormatter(input)).toBe(expected);
    });
  });

  describe('leading zero handling', () => {
    type Case = { name: string; input: string; expected: string };

    const leadingZeroCases: Case[] = [
      { name: 'remove leading zeros from 01', input: '01', expected: '1' },
      { name: 'remove leading zeros from 001', input: '001', expected: '1' },
      {
        name: 'remove leading zeros from 0123',
        input: '0123',
        expected: '123',
      },
      { name: 'preserve single zero', input: '0', expected: '0' },
      { name: 'convert 000 to 0', input: '000', expected: '0' },
      { name: 'preserve zero in 0.5', input: '0.5', expected: '0.5' },
      { name: 'preserve zero in 0.0', input: '0.0', expected: '0.0' },
      { name: 'preserve zero in 0.123', input: '0.123', expected: '0.123' },
      { name: 'handle 01.5', input: '01.5', expected: '1.5' },
      { name: 'handle 001.23', input: '001.23', expected: '1.23' },
    ];

    it.each(leadingZeroCases)('$name', ({ input, expected }) => {
      expect(textFormatter(input)).toBe(expected);
    });
  });

  describe('comma to dot conversion', () => {
    type Case = { name: string; input: string; expected: string };

    const commaCases: Case[] = [
      { name: 'convert 1,5 to 1.5', input: '1,5', expected: '1.5' },
      { name: 'convert 12,34 to 12.34', input: '12,34', expected: '12.34' },
      { name: 'convert ,5 to 0.5', input: ',5', expected: '0.5' },
      {
        name: 'handle multiple commas (1,2,3)',
        input: '1,2,3',
        expected: '1.23',
      },
      { name: 'handle triple commas', input: ',,,', expected: '0.' },
    ];

    it.each(commaCases)('$name', ({ input, expected }) => {
      expect(textFormatter(input)).toBe(expected);
    });
  });

  describe('decimalSeparator display', () => {
    type Case = {
      name: string;
      input: string;
      expected: string;
      options?: TextFormatterOptions;
    };

    const commaSeparatorCases: Case[] = [
      {
        name: 'display dot decimal as comma',
        input: '1.5',
        expected: '1,5',
        options: { decimalSeparator: ',' },
      },
      {
        name: 'display comma input as comma',
        input: '1,5',
        expected: '1,5',
        options: { decimalSeparator: ',' },
      },
      {
        name: 'comma decimal with space thousands',
        input: '1234.5',
        expected: '1 234,5',
        options: { decimalSeparator: ',' },
      },
      {
        name: 'preserve trailing separator while typing',
        input: '12.',
        expected: '12,',
        options: { decimalSeparator: ',' },
      },
      {
        name: 'no decimal part is unaffected',
        input: '1234',
        expected: '1 234',
        options: { decimalSeparator: ',' },
      },
      {
        name: 'integer-only mode is unaffected by comma separator',
        input: '1.5',
        expected: '15',
        options: { decimalSeparator: ',', allowDecimals: false },
      },
      {
        name: 'explicit dot separator matches default',
        input: '1234.5',
        expected: '1 234.5',
        options: { decimalSeparator: '.' },
      },
    ];

    it.each(commaSeparatorCases)('$name', ({ input, expected, options }) => {
      expect(textFormatter(input, options)).toBe(expected);
    });
  });

  describe('non-numeric character removal', () => {
    type Case = { name: string; input: string; expected: string };

    const nonNumericCases: Case[] = [
      {
        name: 'remove letters from abc123def',
        input: 'abc123def',
        expected: '123',
      },
      { name: 'remove $ from $100.50', input: '$100.50', expected: '100.50' },
      {
        name: 'remove special chars from 1@2#3$',
        input: '1@2#3$',
        expected: '123',
      },
      {
        name: 'preserve only digits and dots (1a2b.3c4d)',
        input: '1a2b.3c4d',
        expected: '12.34',
      },
      {
        name: 'remove special chars (!@#1.23$%^)',
        input: '!@#1.23$%^',
        expected: '1.23',
      },
    ];

    it.each(nonNumericCases)('$name', ({ input, expected }) => {
      expect(textFormatter(input)).toBe(expected);
    });
  });

  describe('integer-only mode with allowDecimals=false', () => {
    type Case = {
      name: string;
      input: string;
      expected: string;
      options?: { allowDecimals: boolean };
    };

    const integerOnlyCases: Case[] = [
      {
        name: 'remove decimal from 1.5',
        input: '1.5',
        expected: '15',
        options: { allowDecimals: false },
      },
      {
        name: 'remove decimal from 123.456',
        input: '123.456',
        expected: '123 456',
        options: { allowDecimals: false },
      },
      {
        name: 'remove decimal from .5',
        input: '.5',
        expected: '5',
        options: { allowDecimals: false },
      },
      {
        name: 'remove non-digits from abc123def',
        input: 'abc123def',
        expected: '123',
        options: { allowDecimals: false },
      },
      {
        name: 'remove $ from $100',
        input: '$100',
        expected: '100',
        options: { allowDecimals: false },
      },
      {
        name: 'remove commas from 1,2,3',
        input: '1,2,3',
        expected: '123',
        options: { allowDecimals: false },
      },
      {
        name: 'handle leading zeros in 01',
        input: '01',
        expected: '1',
        options: { allowDecimals: false },
      },
      {
        name: 'handle leading zeros in 001',
        input: '001',
        expected: '1',
        options: { allowDecimals: false },
      },
      {
        name: 'convert 000 to 0',
        input: '000',
        expected: '0',
        options: { allowDecimals: false },
      },
    ];

    it.each(integerOnlyCases)('$name', ({ input, expected, options }) => {
      expect(textFormatter(input, options)).toBe(expected);
    });
  });

  describe('edge cases and empty input', () => {
    type Case = { name: string; input: string; expected: string };

    const edgeCases: Case[] = [
      { name: 'handle empty string', input: '', expected: '' },
      {
        name: 'handle strings with no digits (abc)',
        input: 'abc',
        expected: '',
      },
      {
        name: 'handle strings with no digits (!@#$%^)',
        input: '!@#$%^',
        expected: '',
      },
      {
        name: 'handle whitespace ( 1 2 3 )',
        input: ' 1 2 3 ',
        expected: '123',
      },
      { name: 'handle whitespace ( 1.5 )', input: ' 1.5 ', expected: '1.5' },
    ];

    it.each(edgeCases)('$name', ({ input, expected }) => {
      expect(textFormatter(input)).toBe(expected);
    });
  });

  describe('length limits with maxIntegerLength and maxDecimalLength', () => {
    describe('integer length limits', () => {
      type Case = {
        name: string;
        input: string;
        expected: string;
        options?: {
          thousandsSeparator?: boolean;
          maxIntegerLength?: number;
        };
      };

      const integerLimitCases: Case[] = [
        {
          name: 'limit to 5 digits (123456789)',
          input: '123456789',
          expected: '12345',
          options: { thousandsSeparator: false, maxIntegerLength: 5 },
        },
        {
          name: 'limit to 3 digits (987654321)',
          input: '987654321',
          expected: '987',
          options: { thousandsSeparator: false, maxIntegerLength: 3 },
        },
        {
          name: 'truncate 10th digit (1000000000)',
          input: '1000000000',
          expected: '100000000',
          options: { thousandsSeparator: false },
        },
        {
          name: 'allow exactly 9 digits',
          input: '123456789',
          expected: '123456789',
          options: { thousandsSeparator: false },
        },
        {
          name: 'allow exactly maxIntegerLength digits',
          input: '12345',
          expected: '12345',
          options: { thousandsSeparator: false, maxIntegerLength: 5 },
        },
        {
          name: 'handle limits with thousands separator (123456789)',
          input: '123456789',
          expected: '123 456 789',
        },
        {
          name: 'truncate 10th digit with thousands separator',
          input: '1234567890',
          expected: '123 456 789',
        },
        {
          name: 'handle 5-digit limit with thousands separator',
          input: '12345',
          expected: '12 345',
          options: { maxIntegerLength: 5 },
        },
      ];

      it.each(integerLimitCases)('$name', ({ input, expected, options }) => {
        expect(textFormatter(input, options)).toBe(expected);
      });
    });

    describe('decimal length limits', () => {
      type Case = {
        name: string;
        input: string;
        expected: string;
        options?: {
          thousandsSeparator?: boolean;
          maxDecimalLength?: number;
        };
      };

      const decimalLimitCases: Case[] = [
        {
          name: 'limit to 5 decimals (123.456789012)',
          input: '123.456789012',
          expected: '123.45678',
          options: { thousandsSeparator: false, maxDecimalLength: 5 },
        },
        {
          name: 'limit to 3 decimals (1.123456789)',
          input: '1.123456789',
          expected: '1.123',
          options: { thousandsSeparator: false, maxDecimalLength: 3 },
        },
        {
          name: 'limit to 2 decimals (0.987654321)',
          input: '0.987654321',
          expected: '0.98',
          options: { thousandsSeparator: false, maxDecimalLength: 2 },
        },
        {
          name: 'allow exactly 9 decimals',
          input: '123.123456789',
          expected: '123.123456789',
          options: { thousandsSeparator: false },
        },
        {
          name: 'allow exactly maxDecimalLength digits',
          input: '1.12345',
          expected: '1.12345',
          options: { thousandsSeparator: false, maxDecimalLength: 5 },
        },
        {
          name: 'handle 5 decimal limit with thousands separator',
          input: '123456.789012345',
          expected: '123 456.78901',
          options: { maxDecimalLength: 5 },
        },
        {
          name: 'handle 9 decimals with thousands separator',
          input: '1234567.123456789',
          expected: '1 234 567.123456789',
        },
      ];

      it.each(decimalLimitCases)('$name', ({ input, expected, options }) => {
        expect(textFormatter(input, options)).toBe(expected);
      });
    });

    describe('combined length limits (18 total digits)', () => {
      type Case = {
        name: string;
        input: string;
        expected: string;
        options?: { thousandsSeparator?: boolean };
      };

      const combinedLimitCases: Case[] = [
        {
          name: 'allow 9 integer + 9 decimal (no separator)',
          input: '123456789.987654321',
          expected: '123456789.987654321',
          options: { thousandsSeparator: false },
        },
        {
          name: 'allow 9 integer + 9 decimal (with separator)',
          input: '123456789.987654321',
          expected: '123 456 789.987654321',
        },
        {
          name: 'truncate excess in integer part (10 + 9)',
          input: '1234567890.123456789',
          expected: '123456789.123456789',
          options: { thousandsSeparator: false },
        },
        {
          name: 'truncate excess in decimal part (9 + 10)',
          input: '123456789.9876543210',
          expected: '123456789.987654321',
          options: { thousandsSeparator: false },
        },
        {
          name: 'truncate excess in both parts (11 + 11)',
          input: '12345678901.98765432109',
          expected: '123456789.987654321',
          options: { thousandsSeparator: false },
        },
      ];

      it.each(combinedLimitCases)('$name', ({ input, expected, options }) => {
        expect(textFormatter(input, options)).toBe(expected);
      });
    });

    describe('edge cases with length limits', () => {
      type Case = {
        name: string;
        input: string;
        expected: string;
        options?: {
          thousandsSeparator?: boolean;
          maxIntegerLength?: number;
          maxDecimalLength?: number;
        };
      };

      const lengthEdgeCases: Case[] = [
        {
          name: 'trailing decimal point (123456789.)',
          input: '123456789.',
          expected: '123456789.',
          options: { thousandsSeparator: false },
        },
        {
          name: 'truncate integer with trailing decimal (1234567890.)',
          input: '1234567890.',
          expected: '123456789.',
          options: { thousandsSeparator: false },
        },
        {
          name: 'trailing decimal with custom limits (123.)',
          input: '123.',
          expected: '123.',
          options: {
            thousandsSeparator: false,
            maxIntegerLength: 5,
            maxDecimalLength: 5,
          },
        },
        {
          name: 'remove leading zeros (000123456789)',
          input: '000123456789',
          expected: '123456789',
          options: { thousandsSeparator: false },
        },
        {
          name: 'remove leading zeros and truncate (001234567890)',
          input: '001234567890',
          expected: '123456789',
          options: { thousandsSeparator: false },
        },
        {
          name: 'decimal starting with dot (.123456789)',
          input: '.123456789',
          expected: '0.123456789',
          options: { thousandsSeparator: false },
        },
        {
          name: 'truncate decimal starting with dot (.1234567890)',
          input: '.1234567890',
          expected: '0.123456789',
          options: { thousandsSeparator: false },
        },
        {
          name: 'preserve functionality (123.45)',
          input: '123.45',
          expected: '123.45',
          options: { thousandsSeparator: false },
        },
        {
          name: 'preserve functionality (1.2)',
          input: '1.2',
          expected: '1.2',
        },
      ];

      it.each(lengthEdgeCases)('$name', ({ input, expected, options }) => {
        expect(textFormatter(input, options)).toBe(expected);
      });
    });

    describe('backwards compatibility', () => {
      it('should work with undefined length parameters', () => {
        // When called without length params, should use default behavior
        expect(textFormatter('123456789.123456789')).toBe(
          '123 456 789.123456789',
        ); // Default 9 decimal limit
      });
    });
  });

  describe('complex scenarios', () => {
    type Case = { name: string; input: string; expected: string };

    const complexCases: Case[] = [
      {
        name: 'combination of all edge cases',
        input: '$01,234.567890abc',
        expected: '1.234567890',
      },
      { name: 'realistic input: 100', input: '100', expected: '100' },
      { name: 'realistic input: 100.00', input: '100.00', expected: '100.00' },
      { name: 'realistic input: 0100', input: '0100', expected: '100' },
      { name: 'realistic input: €50.25', input: '€50.25', expected: '50.25' },
    ];

    it.each(complexCases)('$name', ({ input, expected }) => {
      expect(textFormatter(input)).toBe(expected);
    });
  });
});
