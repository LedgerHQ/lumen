import { DisabledProvider } from '@ledgerhq/lumen-utils-shared';
import '@testing-library/jest-dom';
import { act, render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { IconButton } from '../IconButton';
import { TileButton } from '../TileButton';
import { Clipboard } from './Clipboard';
import { ClipboardInput } from './ClipboardInput';

describe('Clipboard', () => {
  let writeText: ReturnType<typeof vi.fn>;

  beforeEach(() => {
    writeText = vi.fn(() => Promise.resolve());
    Object.defineProperty(navigator, 'clipboard', {
      value: { writeText },
      configurable: true,
    });
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('should render the value', () => {
    render(<Clipboard value='Label' />);
    expect(
      screen.getByRole('button', {
        name: 'Label, components.clipboard.copyAriaLabel',
      }),
    ).toBeInTheDocument();
  });

  it('should copy the value and call onCopy when clicked', async () => {
    const onCopy = vi.fn();
    render(<Clipboard value='Label' onCopy={onCopy} />);

    await userEvent.click(screen.getByRole('button'));

    expect(writeText).toHaveBeenCalledWith('Label');
    expect(onCopy).toHaveBeenCalledTimes(1);
    expect(onCopy).toHaveBeenCalledWith('Label');
  });

  it('should show the copied icon for 3 seconds', async () => {
    vi.useFakeTimers({ shouldAdvanceTime: true });
    render(<Clipboard value='Label' />);

    await userEvent.click(screen.getByRole('button'));
    expect(
      await screen.findByRole('button', {
        name: 'Label, components.clipboard.copiedAriaLabel',
      }),
    ).toBeInTheDocument();

    act(() => vi.advanceTimersByTime(3000));
    expect(
      screen.getByRole('button', {
        name: 'Label, components.clipboard.copyAriaLabel',
      }),
    ).toBeInTheDocument();
  });

  it('should show the copied icon for resetAfterMs', async () => {
    vi.useFakeTimers({ shouldAdvanceTime: true });
    render(<Clipboard value='Label' resetAfterMs={1000} />);

    await userEvent.click(screen.getByRole('button'));
    expect(
      await screen.findByRole('button', {
        name: 'Label, components.clipboard.copiedAriaLabel',
      }),
    ).toBeInTheDocument();

    act(() => vi.advanceTimersByTime(1000));
    expect(
      screen.getByRole('button', {
        name: 'Label, components.clipboard.copyAriaLabel',
      }),
    ).toBeInTheDocument();
  });

  it('should not show a new value as copied when it changes during the confirmation', async () => {
    const { rerender } = render(<Clipboard value='A' />);

    await userEvent.click(screen.getByRole('button'));
    expect(
      await screen.findByRole('button', {
        name: 'A, components.clipboard.copiedAriaLabel',
      }),
    ).toBeInTheDocument();

    rerender(<Clipboard value='B' />);
    expect(
      screen.getByRole('button', {
        name: 'B, components.clipboard.copyAriaLabel',
      }),
    ).toBeInTheDocument();
  });

  it('should not show a new value as copied when the previous write settles after it renders', async () => {
    let resolveWrite: () => void = () => undefined;
    writeText.mockImplementation(
      () =>
        new Promise<void>((resolve) => {
          resolveWrite = resolve;
        }),
    );
    const onCopy = vi.fn();
    const { rerender } = render(<Clipboard value='A' onCopy={onCopy} />);

    await userEvent.click(screen.getByRole('button'));
    rerender(<Clipboard value='B' onCopy={onCopy} />);
    await act(async () => resolveWrite());

    expect(onCopy).toHaveBeenCalledWith('A');
    expect(
      screen.getByRole('button', {
        name: 'B, components.clipboard.copyAriaLabel',
      }),
    ).toBeInTheDocument();
  });

  it('should not report a copy when the clipboard write fails', async () => {
    writeText.mockImplementation(() => Promise.reject(new Error('denied')));
    const onCopy = vi.fn();
    render(<Clipboard value='Label' onCopy={onCopy} />);

    await userEvent.click(screen.getByRole('button'));

    await waitFor(() => expect(writeText).toHaveBeenCalled());
    expect(onCopy).not.toHaveBeenCalled();
    expect(
      screen.getByRole('button', {
        name: 'Label, components.clipboard.copyAriaLabel',
      }),
    ).toBeInTheDocument();
  });

  it('should be disabled and not copy inside a disabled ancestor', async () => {
    const onCopy = vi.fn();
    render(
      <DisabledProvider value={{ disabled: true }}>
        <Clipboard value='Label' onCopy={onCopy} />
      </DisabledProvider>,
    );

    const button = screen.getByRole('button');
    expect(button).toBeDisabled();

    await userEvent.click(button);

    expect(writeText).not.toHaveBeenCalled();
    expect(onCopy).not.toHaveBeenCalled();
  });

  it('should pass the copy state to a custom render', async () => {
    vi.useFakeTimers({ shouldAdvanceTime: true });
    render(
      <Clipboard
        value='Label'
        render={({ handleCopy, Icon, statusLabel }) => (
          <TileButton icon={Icon} onClick={handleCopy}>
            {statusLabel}
          </TileButton>
        )}
      />,
    );

    await userEvent.click(
      screen.getByRole('button', {
        name: 'components.clipboard.copyAriaLabel',
      }),
    );

    expect(writeText).toHaveBeenCalledWith('Label');
    expect(
      await screen.findByRole('button', {
        name: 'components.clipboard.copiedAriaLabel',
      }),
    ).toBeInTheDocument();

    act(() => vi.advanceTimersByTime(3000));
    expect(
      screen.getByRole('button', {
        name: 'components.clipboard.copyAriaLabel',
      }),
    ).toBeInTheDocument();
  });

  it('should not copy from a custom render inside a disabled ancestor', async () => {
    render(
      <DisabledProvider value={{ disabled: true }}>
        <Clipboard
          value='Label'
          render={({ handleCopy, Icon, statusLabel }) => (
            <IconButton
              icon={Icon}
              aria-label={statusLabel}
              onClick={handleCopy}
            />
          )}
        />
      </DisabledProvider>,
    );

    await userEvent.click(screen.getByRole('button'), {
      pointerEventsCheck: 0,
    });

    expect(writeText).not.toHaveBeenCalled();
  });
});

describe('ClipboardInput', () => {
  const Icon = () => <svg data-testid='icon' />;

  it('should render the label and icon', () => {
    render(<ClipboardInput label='Label' icon={Icon} />);
    expect(screen.getByRole('button', { name: 'Label' })).toBeInTheDocument();
    expect(screen.getByTestId('icon')).toBeInTheDocument();
  });

  it('should call onClick when clicked', async () => {
    const onClick = vi.fn();
    render(<ClipboardInput label='Label' icon={Icon} onClick={onClick} />);

    await userEvent.click(screen.getByRole('button'));

    expect(onClick).toHaveBeenCalledTimes(1);
  });

  it('should apply a custom className', () => {
    render(<ClipboardInput label='Label' icon={Icon} className='mt-4' />);
    expect(screen.getByRole('button')).toHaveClass('mt-4');
  });

  it('should be disabled inside a disabled ancestor', () => {
    render(
      <DisabledProvider value={{ disabled: true }}>
        <ClipboardInput label='Label' icon={Icon} />
      </DisabledProvider>,
    );
    expect(screen.getByRole('button')).toBeDisabled();
  });
});
