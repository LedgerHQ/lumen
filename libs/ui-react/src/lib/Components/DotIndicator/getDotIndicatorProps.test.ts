import { describe, it, expect } from 'vitest';
import { getDotIndicatorProps } from './getDotIndicatorProps';

describe('getDotIndicatorProps', () => {
  it('resolves avatar dot indicator props', () => {
    expect(getDotIndicatorProps('avatar', 'xs')).toEqual({
      size: 'sm',
      appearance: 'red',
    });
    expect(getDotIndicatorProps('avatar', 'sm')).toEqual({
      size: 'lg',
      appearance: 'red',
    });
    expect(getDotIndicatorProps('avatar', 'md')).toEqual({
      size: 'xl',
      appearance: 'red',
    });
    expect(getDotIndicatorProps('avatar', 'lg')).toEqual({
      size: 'xl',
      appearance: 'red',
    });
    expect(getDotIndicatorProps('avatar', 'xl')).toEqual({
      size: 'xl',
      appearance: 'red',
    });
    expect(getDotIndicatorProps('avatar', '2xl')).toEqual({
      size: 'xl',
      appearance: 'red',
    });
  });
});
