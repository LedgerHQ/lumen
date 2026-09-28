import { describe, expect, it } from 'vitest';
import {
  extractDependencyValue,
  isCatalogReference,
  catalogNameFromReference,
  stripSemverRangePrefix,
  readYamlScalarPath,
} from './resolveVersion.js';

describe('extractDependencyValue', () => {
  it('reads from dependencies first', () => {
    const packageJson = JSON.stringify({
      dependencies: { '@ledgerhq/lumen-ui-react': '^0.1.59' },
      peerDependencies: { '@ledgerhq/lumen-ui-react': '>=0.1.0' },
    });
    expect(
      extractDependencyValue(packageJson, '@ledgerhq/lumen-ui-react'),
    ).toBe('^0.1.59');
  });

  it('falls back to devDependencies then peerDependencies', () => {
    const packageJson = JSON.stringify({
      peerDependencies: { '@ledgerhq/lumen-ui-react': '>=0.1.0' },
    });
    expect(
      extractDependencyValue(packageJson, '@ledgerhq/lumen-ui-react'),
    ).toBe('>=0.1.0');
  });

  it('returns undefined when the package is not declared', () => {
    expect(
      extractDependencyValue('{}', '@ledgerhq/lumen-ui-react'),
    ).toBeUndefined();
  });
});

describe('catalog references', () => {
  it('detects a default catalog reference', () => {
    expect(isCatalogReference('catalog:')).toBe(true);
    expect(catalogNameFromReference('catalog:')).toBeUndefined();
  });

  it('detects a named catalog reference', () => {
    expect(isCatalogReference('catalog:react18')).toBe(true);
    expect(catalogNameFromReference('catalog:react18')).toBe('react18');
  });

  it('is false for an explicit semver range', () => {
    expect(isCatalogReference('^0.1.59')).toBe(false);
  });
});

describe('stripSemverRangePrefix', () => {
  it('strips ^ and ~', () => {
    expect(stripSemverRangePrefix('^0.1.59')).toBe('0.1.59');
    expect(stripSemverRangePrefix('~0.1.59')).toBe('0.1.59');
  });

  it('leaves an exact version untouched', () => {
    expect(stripSemverRangePrefix('0.1.59')).toBe('0.1.59');
  });
});

describe('readYamlScalarPath', () => {
  const ledgerLiveShape = `
packages:
  - "apps/*"
catalog:
  "@ledgerhq/lumen-design-core": 0.1.29
  "@ledgerhq/lumen-ui-react": 0.1.59
  "@ledgerhq/lumen-ui-rnative": 0.1.62
  # Wallet API
  "@ledgerhq/wallet-api-client": 1.15.3
`;

  it('reads a value from the default catalog block', () => {
    expect(
      readYamlScalarPath(ledgerLiveShape, [
        'catalog',
        '@ledgerhq/lumen-ui-react',
      ]),
    ).toBe('0.1.59');
  });

  it('returns undefined for a key not in the catalog', () => {
    expect(
      readYamlScalarPath(ledgerLiveShape, [
        'catalog',
        '@ledgerhq/lumen-utils-shared',
      ]),
    ).toBeUndefined();
  });

  it('returns undefined when the catalog block itself is absent', () => {
    expect(
      readYamlScalarPath('packages:\n  - "apps/*"\n', [
        'catalog',
        '@ledgerhq/lumen-ui-react',
      ]),
    ).toBeUndefined();
  });

  const namedCatalogShape = `
catalogs:
  react18:
    react: 18.3.1
    "@ledgerhq/lumen-ui-react": ^0.1.57
`;

  it('reads a value from a named catalog', () => {
    expect(
      readYamlScalarPath(namedCatalogShape, [
        'catalogs',
        'react18',
        '@ledgerhq/lumen-ui-react',
      ]),
    ).toBe('^0.1.57');
  });
});
