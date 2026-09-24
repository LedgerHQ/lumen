import { describe, it, expect } from 'vitest';
import { parseCliArgs } from './parseCliArgs.js';

describe('parseCliArgs', () => {
  it('should parse a single key-value pair', () => {
    const args = ['--name', 'value'];
    const result = parseCliArgs(args);

    expect(result).toEqual({
      name: 'value',
    });
  });

  it('should parse multiple key-value pairs', () => {
    const args = ['--name', 'John', '--age', '25', '--city', 'Paris'];
    const result = parseCliArgs(args);

    expect(result).toEqual({
      name: 'John',
      age: '25',
      city: 'Paris',
    });
  });

  it('should return empty object for empty args array', () => {
    const args: string[] = [];
    const result = parseCliArgs(args);

    expect(result).toEqual({});
  });

  it('should ignore arguments that do not start with --', () => {
    const args = ['command', '--name', 'value', 'other'];
    const result = parseCliArgs(args);

    expect(result).toEqual({
      name: 'value',
    });
  });

  it('should ignore flags without values', () => {
    const args = ['--flag', '--name', 'value'];
    const result = parseCliArgs(args);

    expect(result).toEqual({
      name: 'value',
    });
  });

  it('should ignore flags at the end without values', () => {
    const args = ['--name', 'value', '--flag'];
    const result = parseCliArgs(args);

    expect(result).toEqual({
      name: 'value',
    });
  });

  it('should not use a value that starts with -- as a parameter value', () => {
    const args = ['--flag1', '--flag2', 'value'];
    const result = parseCliArgs(args);

    expect(result).toEqual({
      flag2: 'value',
    });
  });

  it('should handle values with spaces when passed as single arguments', () => {
    const args = ['--message', 'hello world', '--count', '5'];
    const result = parseCliArgs(args);

    expect(result).toEqual({
      message: 'hello world',
      count: '5',
    });
  });

  it('should handle numeric values as strings', () => {
    const args = ['--port', '8080', '--timeout', '30'];
    const result = parseCliArgs(args);

    expect(result).toEqual({
      port: '8080',
      timeout: '30',
    });
  });

  it('should handle boolean-like values as strings', () => {
    const args = ['--enabled', 'true', '--debug', 'false'];
    const result = parseCliArgs(args);

    expect(result).toEqual({
      enabled: 'true',
      debug: 'false',
    });
  });

  it('should handle empty string values', () => {
    const args = ['--name', '', '--other', 'value'];
    const result = parseCliArgs(args);

    expect(result).toEqual({
      other: 'value',
    });
  });

  it('should handle complex real-world example', () => {
    const args = [
      'node',
      'script.js',
      '--input',
      'src/tokens',
      '--output',
      'dist/css',
      '--format',
      'css',
      '--verbose',
    ];
    const result = parseCliArgs(args);

    expect(result).toEqual({
      input: 'src/tokens',
      output: 'dist/css',
      format: 'css',
    });
  });
});
