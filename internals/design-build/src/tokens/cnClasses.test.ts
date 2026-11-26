import { createTokenModel } from '@lumen/design-sources';
import { describe, expect, it } from 'vitest';
import { cnClassesTarget } from './cnClasses.js';

describe('cnClassesTarget', () => {
  it('lists each text style with its semi-bold steps, as the Tailwind classes name them', async () => {
    const [file] = await cnClassesTarget('out').emit(createTokenModel());
    const steps = JSON.parse(
      file.contents.split(' = ')[1].replace(/;\s*$/, ''),
    );

    expect(file.path).toBe('typography.ts');
    expect(steps.heading.slice(0, 2)).toEqual(['0', '0-semi-bold']);
    expect(steps['responsive-display'].length).toBeGreaterThan(0);
    expect(steps['responsive-display'].join()).not.toContain('semi-bold');
  });
});
