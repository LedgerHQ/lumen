import { describe, it, expect } from 'vitest';
import { createPropsResolver } from './resolveProps';

describe('createPropsResolver', () => {
  const resolveProps = createPropsResolver({
    avatar: {
      sm: { size: 'lg', appearance: 'red' },
      md: { size: 'xl', appearance: 'red' },
    },
  });

  it('resolves the config for a given context and size', () => {
    expect(resolveProps('avatar', 'sm')).toEqual({
      size: 'lg',
      appearance: 'red',
    });
    expect(resolveProps('avatar', 'md')).toEqual({
      size: 'xl',
      appearance: 'red',
    });
  });
});
