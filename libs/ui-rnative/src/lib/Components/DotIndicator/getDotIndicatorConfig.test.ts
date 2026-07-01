import { describe, it, expect } from '@jest/globals';
import { getDotIndicatorConfig } from './getDotIndicatorConfig';

describe('getDotIndicatorConfig', () => {
  it('resolves avatar dot indicator config', () => {
    expect(getDotIndicatorConfig('avatar', 'sm')).toEqual({
      size: 'lg',
      appearance: 'red',
    });
    expect(getDotIndicatorConfig('avatar', 'md')).toEqual({
      size: 'xl',
      appearance: 'red',
    });
  });
});
