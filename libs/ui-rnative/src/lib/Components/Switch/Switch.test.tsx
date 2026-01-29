import { describe, it, expect, jest } from '@jest/globals';
import { ledgerLiveThemes } from '@ledgerhq/lumen-design-core';
import { render, fireEvent, waitFor } from '@testing-library/react-native';
import React from 'react';
import { ThemeProvider } from '../ThemeProvider/ThemeProvider';
import { Switch } from './Switch';

const TestWrapper = ({ children }: { children: React.ReactNode }) => (
  <ThemeProvider themes={ledgerLiveThemes} colorScheme='dark' locale='en'>
    {children}
  </ThemeProvider>
);

describe('Switch', () => {
  it('uncontrolled: toggles on press and reflects checked state', async () => {
    const { getByRole } = render(
      <TestWrapper>
        <Switch defaultChecked={false} />
      </TestWrapper>,
    );

    const trigger = getByRole('switch');
    expect(trigger.props.accessibilityState?.checked).toBe(false);

    fireEvent.press(trigger);

    await waitFor(() =>
      expect(trigger.props.accessibilityState?.checked).toBe(true),
    );
  });

  it('controlled: calls onCheckedChange but state is controlled by parent', async () => {
    const onChange = jest.fn();
    const { getByRole, rerender } = render(
      <TestWrapper>
        <Switch checked={false} onCheckedChange={onChange} />
      </TestWrapper>,
    );

    const trigger = getByRole('switch');
    expect(trigger.props.accessibilityState?.checked).toBe(false);

    fireEvent.press(trigger);

    await waitFor(() => expect(onChange).toHaveBeenCalledWith(true));
    await waitFor(() =>
      expect(trigger.props.accessibilityState?.checked).toBe(false),
    );

    rerender(
      <TestWrapper>
        <Switch checked={true} onCheckedChange={onChange} />
      </TestWrapper>,
    );

    await waitFor(() =>
      expect(getByRole('switch').props.accessibilityState?.checked).toBe(true),
    );
  });

  it('disabled: does not toggle on press', async () => {
    const onChange = jest.fn();
    const { getByRole } = render(
      <TestWrapper>
        <Switch disabled defaultChecked={false} onCheckedChange={onChange} />
      </TestWrapper>,
    );

    const trigger = getByRole('switch');
    expect(trigger.props.accessibilityState?.disabled).toBe(true);

    fireEvent.press(trigger);

    await waitFor(() => expect(onChange).not.toHaveBeenCalled());
    await waitFor(() =>
      expect(trigger.props.accessibilityState?.checked).toBe(false),
    );
  });

  it('passes aria-valuetext to container', () => {
    const { getByTestId, rerender } = render(
      <TestWrapper>
        <Switch aria-valuetext='custom' testID='switch' />
      </TestWrapper>,
    );

    expect(getByTestId('switch').props['aria-valuetext']).toBe('custom');

    rerender(
      <TestWrapper>
        <Switch aria-valuetext='another value' testID='switch' />
      </TestWrapper>,
    );

    expect(getByTestId('switch').props['aria-valuetext']).toBe('another value');
  });
});
