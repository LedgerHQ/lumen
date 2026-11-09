import { describe, expect, it } from 'vitest';
import { loadTokenSources, type SourceFile } from './load.js';
import {
  createTokenModel,
  LUMEN_EXTENSION,
  TokenValidationError,
} from './model.js';

describe('createTokenModel', () => {
  const model = createTokenModel();

  it('lists the modes of each collection from the files', () => {
    expect(model.modesOf('brand')).toEqual([
      'enterprise',
      'ledger-live',
      'websites',
    ]);
    expect(model.modesOf('theme')).toEqual(['dark', 'light']);
    expect(model.modesOf('breakpoint')).toEqual([
      '2xl',
      'lg',
      'md',
      'sm',
      'xl',
      'xs',
    ]);
    expect(model.modesOf('motion')).toEqual([]);
  });

  it('selects one file per collection for a combination of modes', () => {
    const files = model.select(['primitives', 'theme', 'brand'], {
      theme: 'dark',
      brand: 'websites',
    });

    expect(files.map(({ file }) => file)).toEqual([
      'figma/1.primitives.value.tokens.json',
      'figma/2.theme.dark.tokens.json',
      'figma/3.brand.websites.tokens.json',
    ]);
    expect(() => model.select(['theme'])).toThrow(
      'Collection "theme" needs a mode',
    );
  });

  it('resolves a reference chain within the selected modes', () => {
    const files = model.select(['primitives', 'breakpoint'], {
      breakpoint: 'xl',
    });
    const size = model
      .tokens(files)
      .find(({ id }) => id === 'font-style.heading.0.size');

    expect(size?.$value).toBe('{font.size.48}');
    expect(model.resolve(size!, files)).toEqual({ value: 48, unit: 'px' });
  });

  it('resolves references nested in shadow layers', () => {
    const px = (value: number) => ({ value, unit: 'px' as const });
    const black = {
      colorSpace: 'srgb' as const,
      components: [0, 0, 0] as [number, number, number],
      hex: '#000000',
    };
    const sources: SourceFile[] = [
      {
        file: 'figma/1.primitives.value.tokens.json',
        origin: 'figma',
        order: 1,
        collection: 'primitives',
        mode: 'value',
        tokens: { grey: { $type: 'color', $value: black } },
      },
      {
        file: 'code/shadow.tokens.json',
        origin: 'code',
        order: Number.MAX_SAFE_INTEGER,
        collection: 'shadow',
        mode: null,
        tokens: {
          shadow: {
            sm: {
              $type: 'shadow',
              $value: [
                {
                  color: '{grey}',
                  offsetX: px(0),
                  offsetY: px(1),
                  blur: px(2),
                  spread: px(0),
                },
              ],
            },
          },
        },
      },
    ];
    const withShadow = createTokenModel(sources);
    const [shadow] = withShadow
      .tokens(sources)
      .filter(({ id }) => id === 'shadow.sm');

    expect(withShadow.resolve(shadow, sources)).toEqual([
      {
        color: black,
        offsetX: px(0),
        offsetY: px(1),
        blur: px(2),
        spread: px(0),
      },
    ]);
  });

  it('merges files into one tree, tagging each token with its collection', () => {
    const tree = model.tree(
      model.select(['primitives', 'breakpoint'], { breakpoint: 'xs' }),
    ) as never as {
      'font-style': {
        body: { 1: { size: { $extensions: Record<string, unknown> } } };
      };
    };

    expect(
      tree['font-style'].body[1].size.$extensions[LUMEN_EXTENSION],
    ).toEqual({
      collection: 'breakpoint',
      mode: 'xs',
      file: 'figma/4.breakpoint.xs.tokens.json',
    });
  });

  it('refuses invalid sources and lists every problem', () => {
    const broken: SourceFile[] = [
      ...loadTokenSources(),
      {
        file: 'code/broken.tokens.json',
        origin: 'code',
        order: 99,
        collection: 'broken',
        mode: null,
        tokens: { a: { $type: 'color', $value: '{nowhere}' } },
      },
    ];

    expect(() => createTokenModel(broken)).toThrow(TokenValidationError);
    expect(() => createTokenModel(broken)).toThrow(
      'references missing token {nowhere}',
    );
  });
});
