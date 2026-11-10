import { describe, expect, it } from 'vitest';
import { diffSurfaces } from './apiDiff.ts';
import type { ApiSurface } from './apiSurface.ts';

const name = '@ledgerhq/lumen-ui-react';

function surface(overrides: Partial<ApiSurface> = {}): ApiSurface {
  return {
    entries: { '.': ['Button', 'Menu'] },
    props: {
      '.#Button': {
        size: { optional: true, values: ['md', 'sm'] },
        onClick: { optional: true, values: null },
      },
    },
    paths: {},
    files: [],
    tokens: [],
    peers: {},
    optionalPeers: [],
    ...overrides,
  };
}

describe('diffSurfaces', () => {
  it('reports nothing between identical surfaces', () => {
    expect(diffSurfaces(name, surface(), surface())).toEqual([]);
  });

  it('reports a removed entry point once, not each of its exports', () => {
    const before = surface({
      entries: { '.': ['Button', 'Menu'], './symbols': ['Apex'] },
    });

    expect(diffSurfaces(name, before, surface())).toEqual([
      {
        change: 'removed',
        surface: 'module',
        ref: '@ledgerhq/lumen-ui-react/symbols',
      },
    ]);
  });

  it('reports a removed export without its props', () => {
    const after = surface({ entries: { '.': ['Menu'] }, props: {} });

    expect(diffSurfaces(name, surface(), after)).toEqual([
      {
        change: 'removed',
        surface: 'export',
        ref: '@ledgerhq/lumen-ui-react#Button',
      },
    ]);
  });

  it('reports removed props, removed values and newly required props', () => {
    const after = surface({
      props: {
        '.#Button': {
          size: { optional: false, values: ['md'] },
          icon: { optional: false, values: null },
        },
      },
    });

    expect(diffSurfaces(name, surface(), after)).toEqual([
      {
        change: 'required',
        surface: 'member',
        ref: '@ledgerhq/lumen-ui-react#Button.size',
      },
      {
        change: 'removed',
        surface: 'value',
        ref: '@ledgerhq/lumen-ui-react#Button.size=sm',
      },
      {
        change: 'removed',
        surface: 'member',
        ref: '@ledgerhq/lumen-ui-react#Button.onClick',
      },
      {
        change: 'required',
        surface: 'member',
        ref: '@ledgerhq/lumen-ui-react#Button.icon',
      },
    ]);
  });

  it('reports a prop narrowed to literal values', () => {
    const after = surface({
      props: {
        '.#Button': {
          size: { optional: true, values: ['md', 'sm'] },
          onClick: { optional: true, values: ['a'] },
        },
      },
    });

    expect(diffSurfaces(name, surface(), after)).toEqual([
      {
        change: 'changed',
        surface: 'member',
        ref: '@ledgerhq/lumen-ui-react#Button.onClick',
        detail: 'narrowed to a',
      },
    ]);
  });

  it('reports removed files, object paths and CSS tokens', () => {
    const before = surface({
      files: ['./symbols/apex.svg'],
      paths: { '.#themes': ['dark.bg.error', 'dark.bg.muted'] },
      tokens: ['--background-error-hover'],
    });
    const after = surface({ paths: { '.#themes': ['dark.bg.muted'] } });

    expect(diffSurfaces(name, before, after)).toEqual([
      {
        change: 'removed',
        surface: 'module',
        ref: '@ledgerhq/lumen-ui-react/symbols/apex.svg',
      },
      {
        change: 'removed',
        surface: 'token',
        ref: '@ledgerhq/lumen-ui-react#themes.dark.bg.error',
      },
      {
        change: 'removed',
        surface: 'token',
        ref: '@ledgerhq/lumen-ui-react#--background-error-hover',
      },
    ]);
  });

  it('reports new peers and raised peer ranges, not Lumen pins', () => {
    const before = surface({
      peers: {
        react: '^18.0.0 || ^19.0.0',
        '@ledgerhq/lumen-design-core': '0.1.1',
      },
    });
    const after = surface({
      peers: {
        react: '^19.0.0',
        '@base-ui/react': '^1.3.0',
        '@ledgerhq/lumen-design-core': '0.1.2',
      },
    });

    expect(diffSurfaces(name, before, after)).toEqual([
      {
        change: 'changed',
        surface: 'dependency',
        ref: 'react',
        detail: '^18.0.0 || ^19.0.0 → ^19.0.0',
      },
      {
        change: 'required',
        surface: 'dependency',
        ref: '@base-ui/react',
        detail: '^1.3.0',
      },
    ]);
  });

  it('ignores new optional peers, and reports one that becomes required', () => {
    const before = surface({
      peers: { 'react-native-worklets': '>=0.5.0' },
      optionalPeers: ['react-native-worklets'],
    });
    const after = surface({
      peers: {
        'react-native-worklets': '>=0.5.0',
        'react-native-svg': '^15.0.0',
      },
      optionalPeers: ['react-native-svg'],
    });

    expect(diffSurfaces(name, before, after)).toEqual([
      {
        change: 'required',
        surface: 'dependency',
        ref: 'react-native-worklets',
        detail: '>=0.5.0',
      },
    ]);
  });

  it('reports a peer range that drops its newest major', () => {
    const before = surface({
      peers: { 'react-native-safe-area-context': '^4.0.0 || ^5.0.0' },
    });
    const after = surface({
      peers: { 'react-native-safe-area-context': '^4.0.0' },
    });

    expect(diffSurfaces(name, before, after)).toEqual([
      {
        change: 'changed',
        surface: 'dependency',
        ref: 'react-native-safe-area-context',
        detail: '^4.0.0 || ^5.0.0 → ^4.0.0',
      },
    ]);
  });

  it('reports a removed file export as a removed module', () => {
    const before = surface({ files: ['./symbols/apex.svg', './tailwind.css'] });
    const after = surface({ files: ['./symbols/apex.svg'] });

    expect(diffSurfaces(name, before, after)).toEqual([
      {
        change: 'removed',
        surface: 'module',
        ref: '@ledgerhq/lumen-ui-react/tailwind.css',
      },
    ]);
  });
});
