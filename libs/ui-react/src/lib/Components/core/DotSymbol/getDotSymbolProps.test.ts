import { describe, it, expect } from 'vitest';
import { getDotSymbolProps } from './getDotSymbolProps';

describe('getDotSymbolProps', () => {
  it('resolves mediaImage dot symbol props', () => {
    expect(getDotSymbolProps('mediaImage', 12)).toEqual({ size: 8 });
    expect(getDotSymbolProps('mediaImage', 16)).toEqual({ size: 8 });
    expect(getDotSymbolProps('mediaImage', 20)).toEqual({ size: 8 });
    expect(getDotSymbolProps('mediaImage', 24)).toEqual({ size: 10 });
    expect(getDotSymbolProps('mediaImage', 32)).toEqual({ size: 12 });
    expect(getDotSymbolProps('mediaImage', 40)).toEqual({ size: 16 });
    expect(getDotSymbolProps('mediaImage', 48)).toEqual({ size: 20 });
    expect(getDotSymbolProps('mediaImage', 56)).toEqual({ size: 24 });
    expect(getDotSymbolProps('mediaImage', 64)).toEqual({ size: 24 });
    expect(getDotSymbolProps('mediaImage', 72)).toEqual({ size: 32 });
  });

  it('resolves spot dot symbol props', () => {
    expect(getDotSymbolProps('spot', 32)).toEqual({ size: 12 });
    expect(getDotSymbolProps('spot', 40)).toEqual({ size: 16 });
    expect(getDotSymbolProps('spot', 48)).toEqual({ size: 20 });
    expect(getDotSymbolProps('spot', 56)).toEqual({ size: 24 });
    expect(getDotSymbolProps('spot', 72)).toEqual({ size: 32 });
  });
});
