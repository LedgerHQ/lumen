import { describe, expect, it } from 'vitest';
import { createIconModel, validateIcons } from './model.js';

const svg = (body = '<path fill="black"/>', viewBox = ' viewBox="0 0 16 16"') =>
  `<svg width="16" height="16"${viewBox} fill="none">${body}</svg>`;

describe('validateIcons', () => {
  it('accepts black, currentColor, none, and white inside a mask', () => {
    expect(
      validateIcons([
        {
          name: 'arrow-up',
          svg: svg(
            '<mask id="m"><path fill="white"/></mask><path stroke="black" fill="currentColor"/>',
          ),
        },
      ]),
    ).toEqual({ errors: [], warnings: [] });
  });

  it('warns on white outside a mask', () => {
    expect(
      validateIcons([{ name: 'arrow-up', svg: svg('<path fill="white"/>') }])
        .warnings,
    ).toEqual([
      "arrow-up.svg: hard-coded color white won't follow currentColor",
    ]);
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
  it('loads every committed icon', () => {
    const model = createIconModel();

    expect(model.icons).toHaveLength(308);
    expect(model.warnings).toHaveLength(5);
  });
});
