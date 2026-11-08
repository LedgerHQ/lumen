import { act, render } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { useAnimatedHeight } from './useAnimatedHeight';

const Host = ({ enabled = true }: { enabled?: boolean }) => {
  const ref = useAnimatedHeight(enabled);
  return <div ref={ref} />;
};

describe('useAnimatedHeight', () => {
  let notifyResize: () => void;
  let disconnect: ReturnType<typeof vi.fn>;
  let animate: ReturnType<typeof vi.fn>;
  let offsetHeight: ReturnType<typeof vi.spyOn>;
  let animations: {
    onfinish?: () => void;
    cancel: ReturnType<typeof vi.fn>;
  }[];

  beforeEach(() => {
    animations = [];
    notifyResize = () => undefined;
    disconnect = vi.fn();
    vi.stubGlobal(
      'ResizeObserver',
      class {
        constructor(callback: () => void) {
          notifyResize = callback;
        }
        observe = vi.fn();
        disconnect = disconnect;
      },
    );
    animate = vi.fn(() => {
      const animation = { cancel: vi.fn() };
      animations.push(animation);
      return animation;
    });
    HTMLElement.prototype.animate = animate as never;
    offsetHeight = vi
      .spyOn(HTMLElement.prototype, 'offsetHeight', 'get')
      .mockReturnValue(200);
  });

  afterEach(() => {
    offsetHeight.mockRestore();
    vi.unstubAllGlobals();
    // @ts-expect-error restore jsdom's lack of Element.animate
    delete HTMLElement.prototype.animate;
  });

  it('animates from the previous to the new height', () => {
    render(<Host />);
    act(() => notifyResize());
    expect(animate).not.toHaveBeenCalled();

    offsetHeight.mockReturnValue(320);
    act(() => notifyResize());

    expect(animate).toHaveBeenCalledTimes(1);
    expect(animate.mock.calls[0][0]).toMatchObject({
      height: ['200px', '320px'],
    });
  });

  it('ignores resizes caused by its own animation', () => {
    render(<Host />);
    act(() => notifyResize());

    offsetHeight.mockReturnValue(320);
    act(() => notifyResize());
    offsetHeight.mockReturnValue(260);
    act(() => notifyResize());

    expect(animate).toHaveBeenCalledTimes(1);
  });

  it('animates again once the previous animation has finished', () => {
    render(<Host />);
    act(() => notifyResize());

    offsetHeight.mockReturnValue(320);
    act(() => notifyResize());
    act(() => animations[0].onfinish?.());
    offsetHeight.mockReturnValue(100);
    act(() => notifyResize());

    expect(animate).toHaveBeenCalledTimes(2);
    expect(animate.mock.calls[1][0]).toMatchObject({
      height: ['320px', '100px'],
    });
  });

  it('animates from the settled height when content changed mid-animation', () => {
    render(<Host />);
    act(() => notifyResize());

    offsetHeight.mockReturnValue(320);
    act(() => notifyResize());
    offsetHeight.mockReturnValue(260);
    act(() => notifyResize());
    act(() => animations[0].onfinish?.());
    offsetHeight.mockReturnValue(100);
    act(() => notifyResize());

    expect(animate).toHaveBeenCalledTimes(2);
    expect(animate.mock.calls[1][0]).toMatchObject({
      height: ['260px', '100px'],
    });
  });

  it('does not animate when disabled', () => {
    render(<Host enabled={false} />);
    act(() => notifyResize());
    offsetHeight.mockReturnValue(320);
    act(() => notifyResize());

    expect(animate).not.toHaveBeenCalled();
  });

  it('does nothing when ResizeObserver is unavailable', () => {
    vi.stubGlobal('ResizeObserver', undefined);
    render(<Host />);

    expect(animate).not.toHaveBeenCalled();
  });

  it('disconnects and cancels the running animation on unmount', () => {
    const { unmount } = render(<Host />);
    act(() => notifyResize());
    offsetHeight.mockReturnValue(320);
    act(() => notifyResize());

    unmount();

    expect(disconnect).toHaveBeenCalled();
    expect(animations[0].cancel).toHaveBeenCalled();
  });
});
