import { describe, it, expect } from '@jest/globals';
import { getDotIndicatorProps } from './getDotIndicatorProps';

describe('getDotIndicatorProps', () => {
  it('resolves avatar dot indicator props', () => {
    expect(getDotIndicatorProps('avatar', 'sm')).toEqual({
      size: 'lg',
      appearance: 'red',
    });
    expect(getDotIndicatorProps('avatar', 'md')).toEqual({
      size: 'xl',
      appearance: 'red',
    });
  });
});
