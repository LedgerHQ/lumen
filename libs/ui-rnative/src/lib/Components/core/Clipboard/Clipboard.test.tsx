import {
  afterEach,
  beforeEach,
  describe,
  expect,
  it,
  jest,
} from '@jest/globals';
import { ledgerLiveThemes } from '@ledgerhq/lumen-design-core';
import {
  act,
  fireEvent,
  render,
  screen,
  waitFor,
} from '@testing-library/react-native';
import * as ExpoClipboard from 'expo-clipboard';
import type { ReactNode } from 'react';
import { ThemeProvider } from '../ThemeProvider/ThemeProvider';
import { Clipboard } from './Clipboard';

const setStringAsync = jest.mocked(ExpoClipboard.setStringAsync);

const TestWrapper = ({ children }: { children: ReactNode }) => (
  <ThemeProvider themes={ledgerLiveThemes} colorScheme='dark' locale='en'>
    {children}
  </ThemeProvider>
);

const renderClipboard = (ui: ReactNode) =>
  render(<TestWrapper>{ui}</TestWrapper>);

describe('Clipboard', () => {
  beforeEach(() => {
    setStringAsync.mockClear();
    setStringAsync.mockImplementation(() => Promise.resolve(true));
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  it('should render the value with a copy label', () => {
    renderClipboard(<Clipboard testID='clipboard' value='Label' />);

    expect(screen.getByText('Label')).toBeTruthy();
    const root = screen.getByTestId('clipboard');
    expect(root.props.accessibilityRole).toBe('button');
    expect(root.props.accessibilityLabel).toBe('Label, Copy');
  });

  it('should copy the value and call onCopy and onPress when pressed', async () => {
    const onCopy = jest.fn();
    const onPress = jest.fn();
    renderClipboard(
      <Clipboard
        testID='clipboard'
        value='Label'
        onCopy={onCopy}
        onPress={onPress}
      />,
    );

    fireEvent.press(screen.getByTestId('clipboard'));

    await waitFor(() => expect(onCopy).toHaveBeenCalledWith('Label'));
    expect(setStringAsync).toHaveBeenCalledWith('Label');
    expect(onPress).toHaveBeenCalledTimes(1);
  });

  it('should show the copied state for 3 seconds', async () => {
    jest.useFakeTimers();
    renderClipboard(<Clipboard testID='clipboard' value='Label' />);

    fireEvent.press(screen.getByTestId('clipboard'));
    await act(async () => {
      await Promise.resolve();
    });
    expect(screen.getByTestId('clipboard').props.accessibilityLabel).toBe(
      'Label, Copied',
    );

    act(() => {
      jest.advanceTimersByTime(3000);
    });
    expect(screen.getByTestId('clipboard').props.accessibilityLabel).toBe(
      'Label, Copy',
    );
  });

  it('should not report a copy when the clipboard write fails', async () => {
    setStringAsync.mockImplementation(() =>
      Promise.reject(new Error('denied')),
    );
    const onCopy = jest.fn();
    renderClipboard(
      <Clipboard testID='clipboard' value='Label' onCopy={onCopy} />,
    );

    fireEvent.press(screen.getByTestId('clipboard'));

    await waitFor(() => expect(setStringAsync).toHaveBeenCalled());
    expect(onCopy).not.toHaveBeenCalled();
    expect(screen.getByTestId('clipboard').props.accessibilityLabel).toBe(
      'Label, Copy',
    );
  });
});
