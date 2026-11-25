import { describe, expect, it } from 'vitest';
import { outputPaths } from '../config.js';
import { toPascalCase } from '../tokens/naming.js';
import { symbolComponentsTarget } from './components.js';
import { svgTarget } from './svg.js';

const model = {
  icons: [
    {
      name: 'arrow-up',
      svg: '<svg width="16" height="16" viewBox="0 0 16 16" fill="none"><path stroke="black" d="M8 2v12"/></svg>',
    },
    {
      name: 'ai bubble',
      svg: '<svg width="16" height="16" viewBox="0 0 16 16" fill="none"><path fill="black" d="M0 0h4v4H0z"/></svg>',
    },
  ],
  manifest: { lastModified: '2026-11-01', componentIds: ['1:1', '1:2'] },
  warnings: [],
};

describe('toPascalCase', () => {
  it.each([
    ['arrow-up', 'ArrowUp'],
    ['auto-Lock', 'AutoLock'],
    ['ai bubble', 'AiBubble'],
    [' nested', 'Nested'],
  ])('%s → %s', (name, expected) => {
    expect(toPascalCase(name)).toBe(expected);
  });
});

describe('symbolComponentsTarget', () => {
  const target = symbolComponentsTarget({
    name: 'react-symbols',
    outDir: outputPaths.reactSymbols,
    templatePath: `${outputPaths.reactSymbols}/utils/icon-template.ts`,
    native: false,
  });

  it('emits one component per icon and a sorted barrel', async () => {
    const files = await target.emit(model);

    expect(files.map(({ path }) => path)).toEqual([
      'icons/AiBubble.tsx',
      'icons/ArrowUp.tsx',
      'index.ts',
    ]);
    expect(files[1].contents).toContain('stroke="currentColor"');
    expect(files[2].contents).toBe(
      "export { AiBubble } from './icons/AiBubble';\nexport { ArrowUp } from './icons/ArrowUp';\n",
    );
  });

  it('owns the generated icons and barrel, not the hand-written Icon and utils', () => {
    expect(target.owns?.('icons/ArrowUp.tsx')).toBe(true);
    expect(target.owns?.('index.ts')).toBe(true);
    expect(target.owns?.('Icon/Icon.tsx')).toBe(false);
    expect(target.owns?.('utils/icon-template.ts')).toBe(false);
  });
});

describe('svgTarget', () => {
  it('publishes the SVGs as exported, plus the export manifest', () => {
    const files = svgTarget('out').emit(model) as {
      path: string;
      contents: string;
    }[];

    expect(files.map(({ path }) => path)).toEqual([
      'arrow-up.svg',
      'ai bubble.svg',
      'downloadData.json',
    ]);
    expect(files[0].contents).toBe(model.icons[0].svg);
    expect(svgTarget('out').format).toBe(false);
  });
});
