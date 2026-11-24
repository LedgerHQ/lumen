import type { LottieViewRef } from '@ledgerhq/lumen-utils-shared';
import { act, render, screen } from '@testing-library/react';
import { createRef, useEffect, type ReactNode } from 'react';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { ThemeProvider } from '../ThemeProvider';
import { LottieView } from './LottieView';

const player = vi.hoisted(() => {
  const listeners: Record<string, () => void> = {};
  return {
    listeners,
    play: vi.fn(),
    pause: vi.fn(),
    stop: vi.fn(),
    addEventListener: (type: string, listener: () => void) => {
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
});
