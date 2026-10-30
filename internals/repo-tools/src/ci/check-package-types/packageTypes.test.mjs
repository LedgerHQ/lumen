import { describe, expect, it } from 'vitest';
import { publishableLibs } from '../../shared/workspaceProjects.mjs';
import {
  describeProblem,
  policyFor,
  resolutionExceptions,
} from './packageTypes.mjs';

describe('policyFor', () => {
  it('holds an unlisted lib to bundler and node16 ESM', () => {
    expect(policyFor('@ledgerhq/lumen-new-lib')).toEqual({
      checkedResolutions: ['node16-esm', 'bundler'],
      excludeEntrypoints: [],
    });
  });

  it('applies a listed exception on top of the base', () => {
    expect(policyFor('@ledgerhq/lumen-ui-react')).toEqual({
      checkedResolutions: ['bundler'],
      excludeEntrypoints: ['./tailwind.css'],
    });
  });
});

describe('describeProblem', () => {
  it('names the entrypoint and resolution of an entrypoint problem', () => {
    expect(
      describeProblem({
        kind: 'NoResolution',
        entrypoint: './cn',
        resolutionKind: 'node16-esm',
      }),
    ).toBe('Resolution failed: ./cn (node16-esm)');
  });

  it('names the import that failed inside a declaration file', () => {
    expect(
      describeProblem({
        kind: 'InternalResolutionError',
        fileName: '/node_modules/pkg/dist/index.d.ts',
        pos: 0,
        end: 10,
        resolutionOption: 'node16',
        moduleSpecifier: './lib/density',
        resolutionMode: 99,
        trace: [],
      }),
    ).toBe(
      "Internal resolution error: './lib/density' in /node_modules/pkg/dist/index.d.ts (node16)",
    );
  });
});

describe('resolutionExceptions', () => {
  it('gives every exception a reason', () => {
    for (const exception of Object.values(resolutionExceptions)) {
      expect(exception.reason).not.toBe('');
    }
  });

  it('only lists published libs', () => {
    const published = publishableLibs().map((lib) => lib.name);
    for (const name of Object.keys(resolutionExceptions)) {
      expect(published).toContain(name);
    }
  });
});
