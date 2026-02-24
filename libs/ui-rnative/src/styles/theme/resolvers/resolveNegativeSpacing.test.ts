import { describe, it, expect } from '@jest/globals';
import { ledgerLiveThemes } from '@ledgerhq/lumen-design-core';
import { resolveNegativeSpacing } from './resolveNegativeSpacing';

describe('resolveNegativeSpacing', () => {
  it('should create negative entries for each spacing', () => {
    const spacings = {
      s4: 4,
      s8: 8,
      s16: 16,
    } as typeof ledgerLiveThemes.dark.spacings;

    const result = resolveNegativeSpacing(spacings);

    /**
     * Keep positive entries
     */
    expect(result['s4']).toBe(4);
    expect(result['s8']).toBe(8);
    expect(result['s16']).toBe(16);

    /**
     * Create negative entries
     */
    expect(result['-s4']).toBe(-4);
    expect(result['-s8']).toBe(-8);
    expect(result['-s16']).toBe(-16);
  });
});
