import { cleanup, render } from '@testing-library/react';
import React from 'react';
import { createSafeContext } from './createSafeContext.js';

afterEach(() => {
  cleanup();
});

describe('createSafeContext', () => {
  it('throws when used without provider and contextRequired = true', () => {
    type Ctx = { value?: number };
    const [, useSafe] = createSafeContext<Ctx>('RootComponent');

    const Consumer = () => {
      // This should throw because contextRequired is true and there is no Provider
      useSafe({ consumerName: 'Consumer', contextRequired: true });
      return null;
    };

    expect(() => render(React.createElement(Consumer))).toThrow(
      'Consumer must be used within RootComponent',
    );
  });

  it('returns default context when not wrapped and contextRequired = false', () => {
    type Ctx = { value: number };
    const defaultCtx: Ctx = { value: 42 };
    const [, useSafe] = createSafeContext<Ctx>('RootComponent', defaultCtx);

    const Consumer = () => {
      const ctx = useSafe({ consumerName: 'Consumer', contextRequired: false });
      return React.createElement('span', { 'data-testid': 'value' }, ctx.value);
    };

    const { getByTestId } = render(React.createElement(Consumer));
    expect(getByTestId('value').textContent).toBe('42');
  });

  it('provides context value via Provider when wrapped', () => {
    type Ctx = { value: number };
    const [Provider, useSafe] = createSafeContext<Ctx>('RootComponent');

    const Consumer = () => {
      const ctx = useSafe({ consumerName: 'Consumer', contextRequired: false });
      return React.createElement(
        'span',
        { 'data-testid': 'value' },
        String(ctx.value),
      );
    };

    const { getByTestId, rerender } = render(
      React.createElement(Provider, {
        value: { value: 7 },
        children: React.createElement(Consumer),
      }),
    );
    expect(getByTestId('value').textContent).toBe('7');

    // Verify updates propagate
    rerender(
      React.createElement(Provider, {
        value: { value: 8 },
        children: React.createElement(Consumer),
      }),
    );
    expect(getByTestId('value').textContent).toBe('8');
  });
});
