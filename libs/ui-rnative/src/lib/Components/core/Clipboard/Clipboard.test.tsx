import {
  afterEach,
  beforeEach,
  describe,
  expect,
  it,
  jest,
} from '@jest/globals';
import { ledgerLiveThemes } from '@ledgerhq/lumen-design-core';
import { DisabledProvider } from '@ledgerhq/lumen-utils-shared';
import {
  act,
  fireEvent,
  render,
  screen,
  waitFor,
} from '@testing-library/react-native';
import * as ExpoClipboard from 'expo-clipboard';
import type { ReactNode } from 'react';
import { IconButton } from '../IconButton';
import { ThemeProvider } from '../ThemeProvider/ThemeProvider';
import { TileButton } from '../TileButton';
import { Clipboard } from './Clipboard';
import { ClipboardInput } from './ClipboardInput';

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
    renderClipboard(<Clipboard value='Label' />);

    expect(screen.getByText('Label')).toBeTruthy();
    expect(screen.getByRole('button').props.accessibilityLabel).toBe(
      'Label, Copy',
    );
  });

  it('should copy the value and call onCopy when pressed', async () => {
    const onCopy = jest.fn();
    renderClipboard(<Clipboard value='Label' onCopy={onCopy} />);

    fireEvent.press(screen.getByRole('button'));

    await waitFor(() => expect(onCopy).toHaveBeenCalledWith('Label'));
    expect(setStringAsync).toHaveBeenCalledWith('Label');
  });

  it('should show the copied state for 3 seconds', async () => {
    jest.useFakeTimers();
    renderClipboard(<Clipboard value='Label' />);

    fireEvent.press(screen.getByRole('button'));
    await act(async () => {
      await Promise.resolve();
    });
    expect(screen.getByRole('button').props.accessibilityLabel).toBe(
      'Label, Copied',
    );

    act(() => {
      jest.advanceTimersByTime(3000);
    });
    expect(screen.getByRole('button').props.accessibilityLabel).toBe(
      'Label, Copy',
    );
  });

  it('should show the copied state for resetAfterMs', async () => {
    jest.useFakeTimers();
    renderClipboard(<Clipboard value='Label' resetAfterMs={1000} />);

    fireEvent.press(screen.getByRole('button'));
    await act(async () => {
      await Promise.resolve();
    });
    expect(screen.getByRole('button').props.accessibilityLabel).toBe(
      'Label, Copied',
    );

    act(() => {
      jest.advanceTimersByTime(1000);
    });
    expect(screen.getByRole('button').props.accessibilityLabel).toBe(
      'Label, Copy',
    );
  });

  it('should not show a new value as copied when it changes during the confirmation', async () => {
    renderClipboard(<Clipboard value='A' />);

    fireEvent.press(screen.getByRole('button'));
    await waitFor(() =>
      expect(screen.getByRole('button').props.accessibilityLabel).toBe(
        'A, Copied',
      ),
    );

    screen.rerender(
      <TestWrapper>
        <Clipboard value='B' />
      </TestWrapper>,
    );
    expect(screen.getByRole('button').props.accessibilityLabel).toBe('B, Copy');
  });

  it('should not show a new value as copied when the previous write settles after it renders', async () => {
    let resolveWrite: (success: boolean) => void = () => undefined;
    setStringAsync.mockImplementation(
      () =>
        new Promise<boolean>((resolve) => {
          resolveWrite = resolve;
        }),
    );
    const onCopy = jest.fn();
    renderClipboard(<Clipboard value='A' onCopy={onCopy} />);

    fireEvent.press(screen.getByRole('button'));
    screen.rerender(
      <TestWrapper>
        <Clipboard value='B' onCopy={onCopy} />
      </TestWrapper>,
    );
    await act(async () => resolveWrite(true));

    expect(onCopy).toHaveBeenCalledWith('A');
    expect(screen.getByRole('button').props.accessibilityLabel).toBe('B, Copy');
  });

  it('should not report a copy when the clipboard write fails', async () => {
    setStringAsync.mockImplementation(() =>
      Promise.reject(new Error('denied')),
    );
    const onCopy = jest.fn();
    renderClipboard(<Clipboard value='Label' onCopy={onCopy} />);

    fireEvent.press(screen.getByRole('button'));

    await waitFor(() => expect(setStringAsync).toHaveBeenCalled());
    expect(onCopy).not.toHaveBeenCalled();
    expect(screen.getByRole('button').props.accessibilityLabel).toBe(
      'Label, Copy',
    );
  });

  it('should not report a copy when the clipboard write resolves false', async () => {
    setStringAsync.mockImplementation(() => Promise.resolve(false));
    const onCopy = jest.fn();
    renderClipboard(<Clipboard value='Label' onCopy={onCopy} />);

    fireEvent.press(screen.getByRole('button'));

    await waitFor(() => expect(setStringAsync).toHaveBeenCalled());
    expect(onCopy).not.toHaveBeenCalled();
    expect(screen.getByRole('button').props.accessibilityLabel).toBe(
      'Label, Copy',
    );
  });

  it('should be disabled and not copy inside a disabled ancestor', () => {
    const onCopy = jest.fn();
    renderClipboard(
      <DisabledProvider value={{ disabled: true }}>
        <Clipboard value='Label' onCopy={onCopy} />
      </DisabledProvider>,
    );

    const root = screen.getByRole('button');
    expect(root.props.accessibilityState).toMatchObject({ disabled: true });

    fireEvent.press(root);

    expect(setStringAsync).not.toHaveBeenCalled();
    expect(onCopy).not.toHaveBeenCalled();
  });

  it('should pass the copy state to a custom render', async () => {
    jest.useFakeTimers();
    renderClipboard(
      <Clipboard
        value='Label'
        render={({ handleCopy, Icon, statusLabel }) => (
          <TileButton icon={Icon} onPress={handleCopy}>
            {statusLabel}
          </TileButton>
        )}
      />,
    );

    fireEvent.press(screen.getByText('Copy'));
    await act(async () => {
      await Promise.resolve();
    });
    expect(setStringAsync).toHaveBeenCalledWith('Label');
    expect(screen.getByText('Copied')).toBeTruthy();

    act(() => {
      jest.advanceTimersByTime(3000);
    });
    expect(screen.getByText('Copy')).toBeTruthy();
  });

  it('should not copy from a custom render inside a disabled ancestor', () => {
    renderClipboard(
      <DisabledProvider value={{ disabled: true }}>
        <Clipboard
          value='Label'
          render={({ handleCopy, Icon, statusLabel }) => (
            <IconButton
              testID='icon-button'
              icon={Icon}
              accessibilityLabel={statusLabel}
              onPress={handleCopy}
            />
          )}
        />
      </DisabledProvider>,
    );

    fireEvent.press(screen.getByTestId('icon-button'));

    expect(setStringAsync).not.toHaveBeenCalled();
  });
});

describe('ClipboardInput', () => {
  const Icon = () => null;

  it('should render the label', () => {
    renderClipboard(<ClipboardInput label='Label' icon={Icon} />);
    expect(screen.getByText('Label')).toBeTruthy();
  });

  it('should call onPress when pressed', () => {
    const onPress = jest.fn();
    renderClipboard(
      <ClipboardInput
        testID='input'
        label='Label'
        icon={Icon}
        onPress={onPress}
      />,
    );

    fireEvent.press(screen.getByTestId('input'));

    expect(onPress).toHaveBeenCalledTimes(1);
  });

  it('should be disabled inside a disabled ancestor', () => {
    const onPress = jest.fn();
    renderClipboard(
      <DisabledProvider value={{ disabled: true }}>
        <ClipboardInput
          testID='input'
          label='Label'
          icon={Icon}
          onPress={onPress}
        />
      </DisabledProvider>,
    );

    const input = screen.getByTestId('input');
    expect(input.props.accessibilityState).toMatchObject({ disabled: true });
    fireEvent.press(input);
    expect(onPress).not.toHaveBeenCalled();
  });
});
