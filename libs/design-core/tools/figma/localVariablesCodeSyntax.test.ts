import { describe } from 'node:test';
import { it, expect } from 'vitest';
import figmaApiMock from './apiMock.js';
import {
  findVariablesEndingByDefault,
  codeSyntaxFromVariableNameEndingByDefault,
} from './localVariablesCodeSyntax.js';

describe('transform code syntax', () => {
  it('find variables ending with default', async () => {
    const localVariablesMockResponse =
      await figmaApiMock.getMocksFromFileSystem(
        'get-local-variables-response.json',
      );
    const filteredVariables = findVariablesEndingByDefault(
      Object.values(localVariablesMockResponse.meta.variables),
    );

    expect(filteredVariables.length).toBe(4);
    expect(filteredVariables.map((variable) => variable.name).sort()).toEqual([
      'Background/Drawer/default',
      'Border Width/Default',
      'Content/Interactive/Inverted/Default',
      'Surface/Default/Default/Default',
    ]);
  });

  it('create variable name by removing all /Default', () => {
    expect(
      codeSyntaxFromVariableNameEndingByDefault(
        'Content/Interactive/Inverted/Default',
      ),
    ).toBe('var(--content-interactive-inverted);');

    expect(
      codeSyntaxFromVariableNameEndingByDefault(
        'Content/Interactive/Inverted/default',
      ),
    ).toBe('var(--content-interactive-inverted);');

    expect(
      codeSyntaxFromVariableNameEndingByDefault(
        'Surface/Default/Default/Default',
      ),
    ).toBe('var(--surface);');

    expect(
      codeSyntaxFromVariableNameEndingByDefault('Border Width/Default'),
    ).toBe('var(--border-width);');
  });

  it("doesn't Default if part of a wider string", () => {
    expect(
      codeSyntaxFromVariableNameEndingByDefault(
        'Surface/Do Not Remove Default/Default',
      ),
    ).toBe('var(--surface-do-not-remove-default);');

    expect(
      codeSyntaxFromVariableNameEndingByDefault(
        'Surface/Do Not Remove default/Default',
      ),
    ).toBe('var(--surface-do-not-remove-default);');
  });
});
