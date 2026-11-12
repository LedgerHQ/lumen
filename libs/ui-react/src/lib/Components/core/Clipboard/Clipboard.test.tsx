import { DisabledProvider } from '@ledgerhq/lumen-utils-shared';
import '@testing-library/jest-dom';
import { act, render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { Clipboard } from './Clipboard';

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

  it('should call onClick and skip the copy when the event is prevented', async () => {
    const onClick = vi.fn((event: { preventDefault: () => void }) =>
      event.preventDefault(),
    );
    render(<Clipboard value='Label' onClick={onClick} />);

    await userEvent.click(screen.getByRole('button'));

    expect(onClick).toHaveBeenCalledTimes(1);
    expect(writeText).not.toHaveBeenCalled();
  });

  it('should apply a custom className', () => {
    render(<Clipboard value='Label' className='mt-4' />);
    expect(screen.getByRole('button')).toHaveClass('mt-4');
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
});
