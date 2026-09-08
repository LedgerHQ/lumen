import { describe, it, expect } from '@jest/globals';
import { getDotIconProps, mediaImageDotIconSizeMap } from './index';

describe('getDotIconProps', () => {
  it('resolves mediaImage dot icon props', () => {
    expect(getDotIconProps('mediaImage', 40)).toEqual({ size: 16 });
    expect(getDotIconProps('mediaImage', 48)).toEqual({ size: 20 });
    expect(getDotIconProps('mediaImage', 56)).toEqual({ size: 24 });
    expect(getDotIconProps('mediaImage', 64)).toEqual({ size: 24 });
    expect(getDotIconProps('mediaImage', 72)).toEqual({ size: 32 });
  });

  it('exports mediaImageDotIconSizeMap shim', () => {
    expect(mediaImageDotIconSizeMap[56]).toBe(24);
  });

  it('resolves spot dot icon props', () => {
    expect(getDotIconProps('spot', 40)).toEqual({ size: 16 });
    expect(getDotIconProps('spot', 48)).toEqual({ size: 20 });
    expect(getDotIconProps('spot', 56)).toEqual({ size: 24 });
    expect(getDotIconProps('spot', 72)).toEqual({ size: 32 });
  });
});
