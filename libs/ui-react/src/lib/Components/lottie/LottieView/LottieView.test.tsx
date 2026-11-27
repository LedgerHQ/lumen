import type { LottieViewRef } from '@ledgerhq/lumen-utils-shared';
import { act, render, screen } from '@testing-library/react';
import { createRef, useEffect, type ReactNode } from 'react';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { ThemeProvider } from '../../core/ThemeProvider';
import { LottieView } from './LottieView';

const player = vi.hoisted(() => {
  const listeners: Record<string, (event?: unknown) => void> = {};
  return {
    listeners,
    play: vi.fn(),
    pause: vi.fn(),
    stop: vi.fn(),
    addEventListener: (type: string, listener: (event?: unknown) => void) => {
      listeners[type] = listener;
    },
    removeEventListener: vi.fn(),
  };
});

vi.mock('@lottiefiles/dotlottie-react', () => ({
  DotLottieReact: ({
    src,
    dotLottieRefCallback,
  }: {
    src?: string;
    dotLottieRefCallback: (instance: unknown) => void;
  }) => {
    useEffect(() => dotLottieRefCallback(player), [dotLottieRefCallback]);
    return <canvas data-testid='lottie' data-src={src} />;
  },
}));

const animation = { light: 'light.lottie', dark: 'dark.lottie' };

const renderLottie = (props: Partial<Parameters<typeof LottieView>[0]> = {}) =>
  render(<LottieView animation={animation} {...props} />, {
    wrapper: ({ children }: { children: ReactNode }) => (
      <ThemeProvider colorScheme='dark'>{children}</ThemeProvider>
    ),
  });

const getSrc = () => screen.getByTestId('lottie').getAttribute('data-src');

describe('LottieView', () => {
  afterEach(() => {
    vi.clearAllMocks();
  });

  it('plays the variant matching the theme', () => {
    renderLottie();
    expect(getSrc()).toBe(animation.dark);
  });

  it('plays the forced color scheme over the theme', () => {
    renderLottie({ colorScheme: 'light' });
    expect(getSrc()).toBe(animation.light);
  });

  it('autoplays once loaded', () => {
    renderLottie();
    act(() => player.listeners.load?.());
    expect(player.play).toHaveBeenCalledTimes(1);
  });

  it('calls onComplete when the animation finishes', () => {
    const onComplete = vi.fn();
    renderLottie({ onComplete });
    act(() => player.listeners.complete?.());
    expect(onComplete).toHaveBeenCalledTimes(1);
  });

  it('exposes play, pause and stop through the ref', () => {
    const ref = createRef<LottieViewRef>();
    renderLottie({ ref });

    act(() => ref.current?.play());
    expect(player.play).toHaveBeenCalledTimes(1);

    act(() => ref.current?.pause());
    expect(player.pause).toHaveBeenCalledTimes(1);

    act(() => ref.current?.stop());
    expect(player.stop).toHaveBeenCalledTimes(1);
  });

  it('does not autoplay on load when autoPlay is false', () => {
    renderLottie({ autoPlay: false });
    act(() => player.listeners.load?.());
    expect(player.play).not.toHaveBeenCalled();
  });

  it('does not autoplay on load when it starts paused', () => {
    renderLottie({ paused: true });
    act(() => player.listeners.load?.());
    expect(player.play).not.toHaveBeenCalled();
  });

  it('pauses then plays when paused is toggled', () => {
    const { rerender } = renderLottie();

    rerender(<LottieView animation={animation} paused />);
    expect(player.pause).toHaveBeenCalledTimes(1);
    expect(player.play).not.toHaveBeenCalled();

    rerender(<LottieView animation={animation} paused={false} />);
    expect(player.play).toHaveBeenCalledTimes(1);
  });

  it('calls onLoop on each loop', () => {
    const onLoop = vi.fn();
    renderLottie({ loop: true, onLoop });
    act(() => player.listeners.loop?.());
    expect(onLoop).toHaveBeenCalledTimes(1);
  });

  it('passes the load error to onError', () => {
    const onError = vi.fn();
    const error = new Error('invalid animation');
    renderLottie({ onError });
    act(() => player.listeners.loadError?.({ error }));
    expect(onError).toHaveBeenCalledWith(error);
  });
});
