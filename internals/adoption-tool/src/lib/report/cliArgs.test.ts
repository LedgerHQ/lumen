import { describe, expect, it } from 'vitest';
import { parseCliArgs, parseReportFormat } from './cliArgs.js';

describe('parseCliArgs', () => {
  it('reads space-separated --key value pairs', () => {
    expect(parseCliArgs(['--format', 'summary'])).toEqual({
      format: 'summary',
    });
  });

  it('supports multiple flags', () => {
    expect(parseCliArgs(['--format', 'summary', '--verbose', 'true'])).toEqual({
      format: 'summary',
      verbose: 'true',
    });
  });

  it('ignores a flag with no following value', () => {
    expect(parseCliArgs(['--format'])).toEqual({});
  });

  it('ignores a flag immediately followed by another flag', () => {
    expect(parseCliArgs(['--format', '--verbose', 'true'])).toEqual({
      verbose: 'true',
    });
  });

  it('returns an empty object for no args', () => {
    expect(parseCliArgs([])).toEqual({});
  });
});

describe('parseReportFormat', () => {
  it('defaults to markdown when --format is omitted', () => {
    expect(parseReportFormat([])).toBe('markdown');
  });

  it('accepts --format summary', () => {
    expect(parseReportFormat(['--format', 'summary'])).toBe('summary');
  });

  it('accepts --format markdown explicitly', () => {
    expect(parseReportFormat(['--format', 'markdown'])).toBe('markdown');
  });

  it('rejects an unknown format', () => {
    expect(() => parseReportFormat(['--format', 'html'])).toThrow(
      /Invalid --format "html"/,
    );
  });
});
