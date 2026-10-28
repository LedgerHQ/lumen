import { describe, expect, it } from 'vitest';
import {
  libByPackageName,
  libs,
  publishableLibs,
} from './workspaceProjects.mjs';

describe('workspaceProjects', () => {
  it('finds the libs on disk with their package names', () => {
    const names = libs().map((lib) => lib.name);
    expect(names).toContain('@ledgerhq/lumen-ui-react');
    expect(names).toContain('@ledgerhq/lumen-design-core');
    expect(names.every((name) => typeof name === 'string')).toBe(true);
  });

  it('treats every lib as publishable only when it is not private', () => {
    const publishable = publishableLibs();
    expect(publishable.length).toBeGreaterThan(0);
    expect(publishable.every((lib) => !lib.isPrivate)).toBe(true);
    expect(publishable.length).toBeLessThanOrEqual(libs().length);
  });

  // The whole point of the helper: CI is handed a package name, not a folder.
  it('resolves a package name back to its directory', () => {
    expect(libByPackageName('@ledgerhq/lumen-ui-react')?.dir).toBe(
      'libs/ui-react',
    );
    expect(libByPackageName('@lumen/not-a-lib')).toBeUndefined();
  });
});
