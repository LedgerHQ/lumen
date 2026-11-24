import { afterEach, describe, expect, it, jest } from '@jest/globals';
import { ledgerLiveThemes } from '@ledgerhq/lumen-design-core';
import type { LottieViewRef } from '@ledgerhq/lumen-utils-shared';
import { act, fireEvent, render, screen } from '@testing-library/react-native';
import RNLottieView from 'lottie-react-native';
import { createRef, type ReactNode } from 'react';
import { ThemeProvider } from '../ThemeProvider/ThemeProvider';
import { LottieView } from './LottieView';

const animation = {
  light: 1,
  dark: { uri: 'https://example.com/dark.lottie' },
};

const renderLottie = (props: Partial<Parameters<typeof LottieView>[0]> = {}) =>
  render(<LottieView testID='lottie' animation={animation} {...props} />, {
    wrapper: ({ children }: { children: ReactNode }) => (
      <ThemeProvider themes={ledgerLiveThemes} colorScheme='dark'>
        {children}
      </ThemeProvider>
    ),
  });

describe('LottieView', () => {
  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('plays the variant matching the theme', () => {
    renderLottie();
    expect(screen.getByTestId('lottie').props.source).toBe(animation.dark);
  });

  it('plays the forced color scheme over the theme', () => {
    renderLottie({ colorScheme: 'light' });
    expect(screen.getByTestId('lottie').props.source).toBe(animation.light);
  });

  it('autoplays once loaded', () => {
    const play = jest.spyOn(RNLottieView.prototype, 'play');
    renderLottie();
    fireEvent(screen.getByTestId('lottie'), 'animationLoaded');
    expect(play).toHaveBeenCalledTimes(1);
  });

  it('calls onComplete when the animation finishes', () => {
    const onComplete = jest.fn();
    renderLottie({ onComplete });
    fireEvent(screen.getByTestId('lottie'), 'animationFinish', false);
    expect(onComplete).toHaveBeenCalledTimes(1);
  });

  it('exposes play, pause and stop through the ref', () => {
    const pause = jest.spyOn(RNLottieView.prototype, 'pause');
    const resume = jest.spyOn(RNLottieView.prototype, 'resume');
    const reset = jest.spyOn(RNLottieView.prototype, 'reset');
    const ref = createRef<LottieViewRef>();
    renderLottie({ ref });

    act(() => ref.current?.pause());
    expect(pause).toHaveBeenCalledTimes(1);

    act(() => ref.current?.play());
    expect(resume).toHaveBeenCalledTimes(1);

    act(() => ref.current?.stop());
    expect(reset).toHaveBeenCalledTimes(1);
  });
});
