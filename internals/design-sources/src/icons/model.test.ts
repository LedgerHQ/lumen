import { describe, expect, it } from 'vitest';
import { createIconModel, validateIcons } from './model.js';

const svg = (body = '<path fill="black"/>', viewBox = ' viewBox="0 0 16 16"') =>
  `<svg width="16" height="16"${viewBox} fill="none">${body}</svg>`;

describe('validateIcons', () => {
  it('accepts black, none and white masks', () => {
    expect(
      validateIcons([
        { name: 'arrow-up', svg: svg('<path stroke="black" fill="white"/>') },
      ]),
    ).toEqual({ errors: [], warnings: [] });
  });

  it('fails on a file that is not an SVG, or one that cannot scale', () => {
    expect(
      validateIcons([
        { name: 'broken', svg: '<html/>' },
        { name: 'fixed', svg: svg(undefined, '') },
      ]).errors,
    ).toEqual([
      'broken.svg: not an <svg> document',
      "fixed.svg: no viewBox, so it can't scale",
    ]);
  });

  it('warns on names and colors designers should fix', () => {
    expect(
      validateIcons([
        { name: 'auto-Lock', svg: svg('<path stroke="#D5D5D5"/>') },
      ]).warnings,
    ).toEqual([
      'auto-Lock.svg: name is not lowercase kebab-case',
      "auto-Lock.svg: hard-coded color #D5D5D5 won't follow currentColor",
    ]);
  });
});

describe('createIconModel', () => {
  it('loads every committed icon and the export manifest', () => {
    const model = createIconModel();

    expect(model.icons).toHaveLength(302);
    expect(model.manifest.componentIds.length).toBeGreaterThanOrEqual(302);
    expect(model.warnings).toHaveLength(5);
  });
});
