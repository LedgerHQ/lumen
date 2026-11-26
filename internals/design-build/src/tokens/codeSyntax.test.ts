import { type CodeSyntaxFile, createTokenModel } from '@lumen/design-sources';
import { describe, expect, it } from 'vitest';
import { codeSyntaxTarget } from './codeSyntax.js';
import { cssLayers } from './cssLayers.js';
import { orderedBreakpoints } from './modes.js';
import { cssVariableName } from './naming.js';

describe('codeSyntaxTarget', () => {
  it('gives Dev Mode exactly the CSS variable names the CSS outputs write', async () => {
    const model = createTokenModel();
    const [file] = await codeSyntaxTarget('out').emit(model);
    const syntax = JSON.parse(file.contents) as CodeSyntaxFile;
    const devModeNames = new Set(
      Object.values(syntax).flatMap((variables) =>
        Object.values(variables).map(({ WEB }) => WEB.slice(4, -2)),
      ),
    );

    // Dev Mode only shows Figma variables: hand-written tokens (shadows) aren't in it.
    const codeOnly = new Set(
      model
        .tokens(model.sources.filter(({ origin }) => origin === 'code'))
        .map(({ path }) => cssVariableName(path)),
    );
    const layers = cssLayers(model, orderedBreakpoints(model));
    const cssNames = new Set(
      [
        layers.primitives,
        ...layers.themes.map(({ declarations }) => declarations),
        ...layers.breakpoints.map(({ declarations }) => declarations),
      ]
        .flatMap(Object.keys)
        .filter((name) => !codeOnly.has(name)),
    );

    expect([...cssNames].filter((name) => !devModeNames.has(name))).toEqual([]);
    expect([...devModeNames].filter((name) => !cssNames.has(name))).toEqual([]);
  });

  it('writes a CSS variable for each, and the same theme path for iOS and Android', async () => {
    const [file] = await codeSyntaxTarget('out').emit(createTokenModel());
    const syntax = JSON.parse(file.contents) as CodeSyntaxFile;
    const entries = Object.values(syntax).flatMap(Object.values);

    expect(entries.length).toBeGreaterThan(0);
    for (const { WEB, iOS, ANDROID } of entries) {
      expect(WEB).toMatch(/^var\(--[a-z0-9-]+\);$/);
      expect(iOS).toBe(ANDROID);
      if (iOS) expect(iOS).toMatch(/^t\./);
    }
  });
});
