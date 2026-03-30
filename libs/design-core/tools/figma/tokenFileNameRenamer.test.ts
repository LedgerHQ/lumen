import { describe } from 'node:test';
import { it, expect } from 'vitest';
import tokenFileNameRenamer from './tokenFileNameRenamer.js';

describe('tokenFileNameRenamer', () => {
  it('rename breakpoints collection', async () => {
    const breakpointCollection = {
      id: '4',
      name: '4.Breakpoint',
      key: 'key',
      modes: [
        { name: 'SM - 360 to 639 px', modeId: 'modeIdSm' },
        { name: 'MD - 640 to 767 px', modeId: 'modeIdMD' },
      ],
      defaultModeId: 'modeId',
      hiddenFromPublishing: false,
      remote: false,
      variableIds: ['id1', 'id2'],
    };

    expect(
      tokenFileNameRenamer(breakpointCollection, breakpointCollection.modes[0]),
    ).toBe('4.Breakpoint.SM.json');
    expect(
      tokenFileNameRenamer(breakpointCollection, breakpointCollection.modes[1]),
    ).toBe('4.Breakpoint.MD.json');
  });

  it('rename brand collection', async () => {
    const brandCollection = {
      id: '3',
      name: '3.Brand',
      key: 'key',
      modes: [
        { name: 'Ledger Live', modeId: 'modeIdLL' },
        { name: 'Entreprise', modeId: 'modeIdLES' },
      ],
      defaultModeId: 'modeId',
      hiddenFromPublishing: false,
      remote: false,
      variableIds: ['id1', 'id2'],
    };

    expect(
      tokenFileNameRenamer(brandCollection, brandCollection.modes[0]),
    ).toBe('3.Brand.LedgerLive.json');
    expect(
      tokenFileNameRenamer(brandCollection, brandCollection.modes[1]),
    ).toBe('3.Brand.Entreprise.json');
  });
});
