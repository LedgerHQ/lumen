import { cleanup, render } from '@testing-library/react';
import React from 'react';
import { DisabledProvider, useDisabledContext } from './disabledContext';

afterEach(() => {
  cleanup();
});

const Consumer = ({ mergeWith }: { mergeWith?: { disabled?: boolean } }) => {
  const disabled = useDisabledContext({
    consumerName: 'TestConsumer',
    mergeWith,
  });
  return React.createElement(
    'span',
    { 'data-testid': 'disabled' },
    String(disabled),
  );
};

describe('disabledContext', () => {
  it('returns false by default when no provider is present', () => {
    const { getByTestId } = render(React.createElement(Consumer));
    expect(getByTestId('disabled').textContent).toBe('false');
  });

  it('returns true when provider sets disabled to true', () => {
    const { getByTestId } = render(
      React.createElement(
        DisabledProvider,
        { value: { disabled: true }, children: '' },
        React.createElement(Consumer),
      ),
    );
    expect(getByTestId('disabled').textContent).toBe('true');
  });

  it('returns false when provider sets disabled to false', () => {
    const { getByTestId } = render(
      React.createElement(
        DisabledProvider,
        { value: { disabled: false }, children: '' },
        React.createElement(Consumer),
      ),
    );
    expect(getByTestId('disabled').textContent).toBe('false');
  });

  it('mergeWith overrides context to disabled when mergeWith.disabled is true', () => {
    const { getByTestId } = render(
      React.createElement(
        DisabledProvider,
        { value: { disabled: false }, children: '' },
        React.createElement(Consumer, { mergeWith: { disabled: true } }),
      ),
    );
    expect(getByTestId('disabled').textContent).toBe('true');
  });

  it('returns context disabled when mergeWith.disabled is false', () => {
    const { getByTestId } = render(
      React.createElement(
        DisabledProvider,
        { value: { disabled: true }, children: '' },
        React.createElement(Consumer, { mergeWith: { disabled: false } }),
      ),
    );
    expect(getByTestId('disabled').textContent).toBe('true');
  });

  it('returns false when both context and mergeWith are false', () => {
    const { getByTestId } = render(
      React.createElement(
        DisabledProvider,
        { value: { disabled: false }, children: '' },
        React.createElement(Consumer, { mergeWith: { disabled: false } }),
      ),
    );
    expect(getByTestId('disabled').textContent).toBe('false');
  });
});
