import { describe, it, expect, vi } from 'vitest';
import { getButtonA11yProps } from './getButtonA11yProps';

describe('getButtonA11yProps', () => {
  it('returns role="button" and tabIndex=0 with an onClick handler', () => {
    const onClick = vi.fn();
    const result = getButtonA11yProps({ onClick });

    expect(result).toMatchObject({
      role: 'button',
      tabIndex: 0,
      onClick,
    });
    expect(result?.onKeyDown).toBeTypeOf('function');
  });

  it('returns disabled a11y props when disabled is true', () => {
    const onClick = vi.fn();
    const result = getButtonA11yProps({ onClick, disabled: true });

    expect(result).toEqual({
      role: 'button',
      tabIndex: -1,
      'aria-disabled': true,
    });
  });

  it('omits click and keyboard handlers when disabled', () => {
    const result = getButtonA11yProps({ onClick: vi.fn(), disabled: true });

    expect(result).not.toHaveProperty('onClick');
    expect(result).not.toHaveProperty('onKeyDown');
  });

  it('calls onClick on Enter key', () => {
    const onClick = vi.fn();
    const result = getButtonA11yProps({ onClick });
    const event = { key: 'Enter', preventDefault: vi.fn() };

    result?.onKeyDown?.(event as any);

    expect(event.preventDefault).toHaveBeenCalled();
    expect(onClick).toHaveBeenCalledTimes(1);
  });

  it('calls onClick on Space key', () => {
    const onClick = vi.fn();
    const result = getButtonA11yProps({ onClick });
    const event = { key: ' ', preventDefault: vi.fn() };

    result?.onKeyDown?.(event as any);

    expect(event.preventDefault).toHaveBeenCalled();
    expect(onClick).toHaveBeenCalledTimes(1);
  });

  it('does not call onClick on other keys', () => {
    const onClick = vi.fn();
    const result = getButtonA11yProps({ onClick });
    const event = { key: 'Tab', preventDefault: vi.fn() };

    result?.onKeyDown?.(event as any);

    expect(event.preventDefault).not.toHaveBeenCalled();
    expect(onClick).not.toHaveBeenCalled();
  });

  it('returns undefined when onClick is not provided', () => {
    expect(getButtonA11yProps({})).toBeUndefined();
  });
});
