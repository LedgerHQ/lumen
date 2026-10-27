import { describe, expect, it } from 'vitest';
import {
  checkPeer,
  isUnbounded,
  unboundedPeerExceptions,
} from './peerDeps.mjs';

/**
 * @param {string} name
 * @param {string} declared
 * @param {string} [installed]
 */
const workspaceWith = (name, declared, installed) => ({
  rootDevDependencies: { [name]: declared },
  lockedPackages: installed
    ? { [`node_modules/${name}`]: { version: installed } }
    : {},
});

describe('checkPeer', () => {
  it('passes when the installed version is inside the peer range', () => {
    expect(
      checkPeer(
        'react',
        '^18.0.0 || ^19.0.0',
        workspaceWith('react', '19.1.4', '19.1.4'),
      ),
    ).toEqual({ ok: true, installed: '19.1.4' });
  });

  it('fails when the peer is not a root devDependency', () => {
    const result = checkPeer('expo', '~54.0.0', {
      rootDevDependencies: {},
      lockedPackages: {},
    });
    expect(result).toEqual({
      ok: false,
      reason: 'peer ~54.0.0 is not in the root devDependencies',
    });
  });

  // A copy nested under another package is not the one our tests import.
  it('fails when the peer is only installed nested', () => {
    const result = checkPeer('react-native-svg', '^15.0.0', {
      rootDevDependencies: { 'react-native-svg': '15.12.1' },
      lockedPackages: {
        'node_modules/foo/node_modules/react-native-svg': {
          version: '15.12.1',
        },
      },
    });
    expect(result).toEqual({
      ok: false,
      reason: 'not installed at the root of package-lock.json',
    });
  });

  it('fails when the installed version is outside the peer range', () => {
    const result = checkPeer(
      'react-native-safe-area-context',
      '~5.6.0',
      workspaceWith('react-native-safe-area-context', '^5.6.0', '5.7.1'),
    );
    expect(result).toEqual({
      ok: false,
      reason: 'installed 5.7.1 is outside peer ~5.6.0',
    });
  });

  // The declared floor (5.0.0) is outside the peer, the installed version is not.
  it('judges the installed version, not the declared range floor', () => {
    expect(
      checkPeer(
        '@gorhom/bottom-sheet',
        '^5.2.0',
        workspaceWith('@gorhom/bottom-sheet', '^5.0.0', '5.2.6'),
      ),
    ).toEqual({ ok: true, installed: '5.2.6' });
  });

  it('fails a peer range without an upper bound', () => {
    const result = checkPeer(
      'react-native-gesture-handler',
      '>=2.0.0',
      workspaceWith('react-native-gesture-handler', '^2.28.0', '2.28.0'),
    );
    expect(result).toEqual({
      ok: false,
      reason: 'peer >=2.0.0 has no upper bound',
    });
  });

  it('accepts an unbounded range listed as an exception', () => {
    expect(
      checkPeer(
        'expo',
        '>=54.0.0',
        workspaceWith('expo', '^54.0.34', '54.0.34'),
        { allowUnbounded: true },
      ),
    ).toEqual({ ok: true, installed: '54.0.34' });
  });

  // Otherwise the exception list keeps names long after the peer was fixed.
  it('fails an exception whose range is bounded now', () => {
    const result = checkPeer(
      'expo',
      '^54.0.0',
      workspaceWith('expo', '^54.0.34', '54.0.34'),
      { allowUnbounded: true },
    );
    expect(result).toEqual({
      ok: false,
      reason:
        'peer ^54.0.0 is bounded now, remove it from unboundedPeerExceptions',
    });
  });
});

describe('isUnbounded', () => {
  it.each(['>=2.0.0', '*', '^18.0.0 || >=20.0.0', '>0'])(
    '%s is unbounded',
    (range) => {
      expect(isUnbounded(range)).toBe(true);
    },
  );

  it.each(['^15.0.0', '~0.81.6', '^4.0.0 || ^5.0.0', '>=2.0.0 <3.0.0'])(
    '%s is bounded',
    (range) => {
      expect(isUnbounded(range)).toBe(false);
    },
  );
});

describe('unboundedPeerExceptions', () => {
  it('gives every exception a reason', () => {
    for (const exceptions of Object.values(unboundedPeerExceptions)) {
      for (const { reason } of exceptions) {
        expect(reason.trim()).not.toBe('');
      }
    }
  });
});
