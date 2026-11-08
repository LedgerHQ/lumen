import { createTokenModel } from '@lumen/design-sources';
import { describe, expect, it } from 'vitest';
import { type CodeSyntaxFile, codeSyntaxTarget } from './codeSyntax.js';
import { cssTarget } from './css.js';

describe('codeSyntaxTarget', () => {
  it('gives Dev Mode exactly the CSS variable names the CSS target writes', async () => {
    const model = createTokenModel();
    const [file] = await codeSyntaxTarget('out').emit(model);
    const syntax = JSON.parse(file.contents) as CodeSyntaxFile;
    const devModeNames = new Set(
      Object.values(syntax).flatMap((variables) =>
        Object.values(variables).map(({ WEB }) => WEB.slice(4, -2)),
      ),
    );

    const cssNames = new Set(
      (await cssTarget('out').emit(model))
        .filter(({ path }) => path !== 'index.ts')
        .flatMap(({ contents }) =>
          [...contents.matchAll(/"(--[a-z0-9-]+)":/g)].map(([, name]) => name),
        ),
    );

    expect([...cssNames].filter((name) => !devModeNames.has(name))).toEqual([]);
    expect([...devModeNames].filter((name) => !cssNames.has(name))).toEqual([]);
  });

  it('keys variables by their Figma collection and name', async () => {
    const [file] = await codeSyntaxTarget('out').emit(createTokenModel());
    const syntax = JSON.parse(file.contents) as CodeSyntaxFile;

    expect(syntax['2.theme']['color/background/grey/default']).toEqual({
      WEB: 'var(--color-background-grey);',
    });
    expect(syntax['3.brand']['background/canvas/default']).toEqual({
      WEB: 'var(--background-canvas);',
      iOS: 't.colors.bg.canvas',
      ANDROID: 't.colors.bg.canvas',
    });
    expect(syntax['1.primitives']['border-radius/2xl']?.iOS).toBe(
      "t.borderRadius['2xl']",
    );
    expect(syntax['4.breakpoint']['font-style/body/1/size']?.iOS).toBe(
      't.typographies.body1.fontSize',
    );
  });
});
