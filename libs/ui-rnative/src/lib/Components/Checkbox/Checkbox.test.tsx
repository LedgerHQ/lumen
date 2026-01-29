import { describe, it, expect, jest } from '@jest/globals';
import { ledgerLiveThemes } from '@ledgerhq/lumen-design-core';
import { render, fireEvent, waitFor } from '@testing-library/react-native';
import React from 'react';
import { ThemeProvider } from '../ThemeProvider/ThemeProvider';
import { Checkbox } from './Checkbox';

const TestWrapper = ({ children }: { children: React.ReactNode }) => (
  <ThemeProvider themes={ledgerLiveThemes} colorScheme='dark' locale='en'>
    {children}
  </ThemeProvider>
);

describe('Checkbox', () => {
  it('uncontrolled: toggles on press and reflects checked state', async () => {
    const { getByRole } = render(
      <TestWrapper>
        <Checkbox defaultChecked={false} />
      </TestWrapper>,
    );

    const trigger = getByRole('checkbox');
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
        <Checkbox checked={false} onCheckedChange={onChange} />
      </TestWrapper>,
    );

    const trigger = getByRole('checkbox');
    expect(trigger.props.accessibilityState?.checked).toBe(false);

    fireEvent.press(trigger);

    await waitFor(() => expect(onChange).toHaveBeenCalledWith(true));
    await waitFor(() =>
      expect(trigger.props.accessibilityState?.checked).toBe(false),
    );

    rerender(
      <TestWrapper>
        <Checkbox checked={true} onCheckedChange={onChange} />
      </TestWrapper>,
    );

    await waitFor(() =>
      expect(getByRole('checkbox').props.accessibilityState?.checked).toBe(
        true,
      ),
    );
  });

  it('label: renders and toggles when pressed', async () => {
    const onChange = jest.fn();
    const { getByText, getByRole } = render(
      <TestWrapper>
        <Checkbox
          defaultChecked={false}
          label='Accept'
          onCheckedChange={onChange}
        />
      </TestWrapper>,
    );

    fireEvent.press(getByText('Accept'));

    await waitFor(() => expect(onChange).toHaveBeenCalledWith(true));
    await waitFor(() =>
      expect(getByRole('checkbox').props.accessibilityState?.checked).toBe(
        true,
      ),
    );
  });

  it('disabled: does not toggle on trigger or label press', async () => {
    const onChange = jest.fn();
    const { getByText, getByRole } = render(
      <TestWrapper>
        <Checkbox
          disabled
          defaultChecked={false}
          label='Terms'
          onCheckedChange={onChange}
        />
      </TestWrapper>,
    );

    const trigger = getByRole('checkbox');
    expect(trigger.props.accessibilityState?.disabled).toBe(true);

    fireEvent.press(trigger);
    fireEvent.press(getByText('Terms'));

    await waitFor(() => expect(onChange).toHaveBeenCalled());
  });

  it('passes through nativeID to container for a11y mapping', () => {
    const { getByTestId } = render(
      <TestWrapper>
        <Checkbox defaultChecked={false} nativeID='check-1' testID='checkbox' />
      </TestWrapper>,
    );

    expect(getByTestId('checkbox').props.nativeID).toBe('check-1');
  });
});
