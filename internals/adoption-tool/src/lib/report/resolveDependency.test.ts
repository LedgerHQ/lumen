import { describe, expect, it } from 'vitest';
import { resolveDependency } from './resolveDependency.js';

const UI_REACT = '@ledgerhq/lumen-ui-react';
const DESIGN_CORE = '@ledgerhq/lumen-design-core';

const pkgJson = (dependencies: Record<string, string>): string =>
  JSON.stringify({ dependencies });

const workspaceYaml = [
  'catalog:',
  `  "${UI_REACT}": ^0.1.60`,
  `  "${DESIGN_CORE}": ^0.1.30`,
  'catalogs:',
  '  legacy:',
  `    "${UI_REACT}": 0.1.40`,
].join('\n');

describe('resolveDependency', () => {
  it('returns an explicit version without touching the catalog', () => {
    expect(
      resolveDependency(
        pkgJson({ [UI_REACT]: '^0.1.59' }),
        UI_REACT,
        undefined,
      ),
    ).toBe('0.1.59');
  });

  it('resolves a default catalog reference', () => {
    expect(
      resolveDependency(
        pkgJson({ [UI_REACT]: 'catalog:' }),
        UI_REACT,
        workspaceYaml,
      ),
    ).toBe('0.1.60');
  });

  it('resolves a named catalog reference', () => {
    expect(
      resolveDependency(
        pkgJson({ [UI_REACT]: 'catalog:legacy' }),
        UI_REACT,
        workspaceYaml,
      ),
    ).toBe('0.1.40');
  });

  it('is not used when the package.json does not declare the package, even if the catalog pins it', () => {
    expect(
      resolveDependency(
        pkgJson({ [DESIGN_CORE]: 'catalog:' }),
        UI_REACT,
        workspaceYaml,
      ),
    ).toBeUndefined();
  });

  it('is not used when the package.json is missing', () => {
    expect(
      resolveDependency(undefined, UI_REACT, workspaceYaml),
    ).toBeUndefined();
  });

  it('keeps the raw reference when pnpm-workspace.yaml is missing', () => {
    expect(
      resolveDependency(
        pkgJson({ [UI_REACT]: 'catalog:' }),
        UI_REACT,
        undefined,
      ),
    ).toBe('catalog:');
  });

  it('keeps the raw reference when the catalog has no entry for the package', () => {
    expect(
      resolveDependency(
        pkgJson({ [UI_REACT]: 'catalog:missing' }),
        UI_REACT,
        workspaceYaml,
      ),
    ).toBe('catalog:missing');
  });
});
