import { describe } from 'node:test';
import { it, expect } from 'vitest';
import { figmaApiMock } from './apiMock.js';
import { tokenFileNameRenamer } from './tokenFileNameRenamer.js';
import { tokenFilesFromLocalVariables } from './tokenFilesFromLocalVariables.js';

describe('tokenFilesFromLocalVariables', () => {
  it('check filenames with default renamer', async () => {
    const localVariablesMockRespoonse =
      await figmaApiMock.getMocksFromFileSystem(
        'get-local-variables-response.json',
      );
    const tokenFilesDictionary = await tokenFilesFromLocalVariables(
      localVariablesMockRespoonse,
    );
    const tokenFilesNames = Object.keys(tokenFilesDictionary);

    expect(tokenFilesNames.sort()).toEqual([
      '1.Primitives.Value.json',
      '2.Theme.Dark.json',
      '2.Theme.Light.json',
      '3.Brand.Entreprise.json',
      '3.Brand.Ledger Live.json',
      '3.Brand.Websites.json',
      '4.Breakpoint.LG - 768 to 1023 px.json',
      '4.Breakpoint.MD - 640 to 767 px.json',
      '4.Breakpoint.SM - 360 to 639 px.json',
      '4.Breakpoint.XL - 1024 & more.json',
    ]);
  });
  it('check file names with a custom filename modifier function', async () => {
    const localVariablesMockRespoonse =
      await figmaApiMock.getMocksFromFileSystem(
        'get-local-variables-response.json',
      );
    const tokenFilesDictionary = await tokenFilesFromLocalVariables(
      localVariablesMockRespoonse,
      tokenFileNameRenamer,
    );
    const tokenFilesNames = Object.keys(tokenFilesDictionary);

    expect(tokenFilesNames.sort()).toEqual([
      '1.Primitives.Value.json',
      '2.Theme.Dark.json',
      '2.Theme.Light.json',
      '3.Brand.Entreprise.json',
      '3.Brand.LedgerLive.json',
      '3.Brand.Websites.json',
      '4.Breakpoint.LG.json',
      '4.Breakpoint.MD.json',
      '4.Breakpoint.SM.json',
      '4.Breakpoint.XL.json',
    ]);
  });

  it('skips EASING variables', async () => {
    const localVariablesMockResponse =
      await figmaApiMock.getMocksFromFileSystem(
        'get-local-variables-response.json',
      );
    localVariablesMockResponse.meta.variables['VariableID:easing'] = {
      ...localVariablesMockResponse.meta.variables['VariableID:2215:48'],
      id: 'VariableID:easing',
      name: 'easing/ease-in',
      resolvedType: 'EASING',
      valuesByMode: {
        '2213:2': {
          easingType: 7,
          bezierValues: { p1x: 0.4, p1y: 0, p2x: 1, p2y: 1 },
        },
      },
    } as never;

    const tokenFilesDictionary = tokenFilesFromLocalVariables(
      localVariablesMockResponse,
    );

    expect(tokenFilesDictionary['1.Primitives.Value.json']).not.toHaveProperty(
      'easing',
    );
    expect(tokenFilesDictionary['1.Primitives.Value.json']).toHaveProperty(
      'Radius',
    );
  });
});
