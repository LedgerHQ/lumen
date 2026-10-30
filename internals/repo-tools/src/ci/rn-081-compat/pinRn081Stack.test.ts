import { describe, expect, it } from 'vitest';
import { pinRn081Stack, RN_081_STACK } from './pinRn081Stack.ts';

const manifest = {
  name: '@ledgerhq/lumen-source',
  devDependencies: {
    'react-native': '0.86.3',
    react: '19.2.3',
    vitest: '4.0.9',
  },
  workspaces: ['apps/*', 'internals/*', 'libs/*'],
};

describe('pinRn081Stack', () => {
  it('overrides the RN stack and adds the pins missing from the manifest', () => {
    const { devDependencies } = pinRn081Stack(manifest);
    expect(devDependencies).toMatchObject(RN_081_STACK);
    expect(devDependencies['react-native']).toBe('0.81.6');
  });

  it('keeps unrelated devDependencies', () => {
    expect(pinRn081Stack(manifest).devDependencies.vitest).toBe('4.0.9');
  });

  // The RN sandbox pins RN 0.86 and Expo 57 exactly, which would fight the pins.
  it('drops the sandbox apps from the workspaces', () => {
    expect(pinRn081Stack(manifest).workspaces).toEqual([
      'internals/*',
      'libs/*',
    ]);
  });

  it('does not mutate its input', () => {
    pinRn081Stack(manifest);
    expect(manifest.devDependencies['react-native']).toBe('0.86.3');
    expect(manifest.workspaces).toHaveLength(3);
  });
});
