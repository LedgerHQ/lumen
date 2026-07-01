import { describe, it, expect } from '@jest/globals';
import { createGetDotConfig } from './getDotConfig';

describe('createGetDotConfig', () => {
  const getConfig = createGetDotConfig({
    avatar: {
      sm: { size: 'lg', appearance: 'red' },
      md: { size: 'xl', appearance: 'red' },
    },
  });

  it('resolves the config for a given context and size', () => {
    expect(getConfig('avatar', 'sm')).toEqual({
      size: 'lg',
      appearance: 'red',
    });
    expect(getConfig('avatar', 'md')).toEqual({
      size: 'xl',
      appearance: 'red',
    });
  });
});
