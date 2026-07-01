import { describe, it, expect } from 'vitest';
import { getDotConfig } from './getDotConfig';

describe('getDotConfig', () => {
  it('resolves avatar dot config', () => {
    expect(getDotConfig('avatar', 'sm')).toEqual({
      size: 'lg',
      appearance: 'red',
    });
    expect(getDotConfig('avatar', 'md')).toEqual({
      size: 'xl',
      appearance: 'red',
    });
  });
});
