import { afterEach, describe, expect, it, jest } from '@jest/globals';
import { ledgerLiveThemes } from '@ledgerhq/lumen-design-core';
import type { LottieViewRef } from '@ledgerhq/lumen-utils-shared';
import { act, fireEvent, render, screen } from '@testing-library/react-native';
import RNLottieView from 'lottie-react-native';
import { createRef, type ReactNode } from 'react';
import { ThemeProvider } from '../../core/ThemeProvider';
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

  it('does not play on load when autoPlay is false', () => {
    const play = jest.spyOn(RNLottieView.prototype, 'play');
    renderLottie({ autoPlay: false });
    fireEvent(screen.getByTestId('lottie'), 'animationLoaded');
    expect(play).not.toHaveBeenCalled();
  });

  it('replays from JS when looping with onLoop, without calling onComplete', () => {
    const reset = jest.spyOn(RNLottieView.prototype, 'reset');
    const resume = jest.spyOn(RNLottieView.prototype, 'resume');
    const onLoop = jest.fn();
    const onComplete = jest.fn();
    renderLottie({ loop: true, onLoop, onComplete });
    expect(screen.getByTestId('lottie').props.loop).toBe(false);

    fireEvent(screen.getByTestId('lottie'), 'animationFinish', false);

    expect(reset).toHaveBeenCalledTimes(1);
    expect(resume).toHaveBeenCalledTimes(1);
    expect(reset.mock.invocationCallOrder[0]).toBeLessThan(
      resume.mock.invocationCallOrder[0],
    );
    expect(onLoop).toHaveBeenCalledTimes(1);
    expect(onComplete).not.toHaveBeenCalled();
  });

  it('restarts through reset when ref.play() is called after the animation finished', () => {
    const reset = jest.spyOn(RNLottieView.prototype, 'reset');
    const resume = jest.spyOn(RNLottieView.prototype, 'resume');
    const ref = createRef<LottieViewRef>();
    renderLottie({ ref });
    fireEvent(screen.getByTestId('lottie'), 'animationFinish', false);

    act(() => ref.current?.play());
    expect(reset).toHaveBeenCalledTimes(1);
    expect(resume).toHaveBeenCalledTimes(1);

    act(() => ref.current?.play());
    expect(reset).toHaveBeenCalledTimes(1);
    expect(resume).toHaveBeenCalledTimes(2);
  });

  it('pauses and resumes when the paused prop toggles', () => {
    const pause = jest.spyOn(RNLottieView.prototype, 'pause');
    const resume = jest.spyOn(RNLottieView.prototype, 'resume');
    const { rerender } = renderLottie();

    rerender(<LottieView testID='lottie' animation={animation} paused />);
    expect(pause).toHaveBeenCalledTimes(1);

    rerender(
      <LottieView testID='lottie' animation={animation} paused={false} />,
    );
    expect(resume).toHaveBeenCalledTimes(1);
  });

  it('restarts through reset when unpaused after the animation finished', () => {
    const reset = jest.spyOn(RNLottieView.prototype, 'reset');
    const resume = jest.spyOn(RNLottieView.prototype, 'resume');
    const { rerender } = renderLottie();
    fireEvent(screen.getByTestId('lottie'), 'animationFinish', false);

    rerender(<LottieView testID='lottie' animation={animation} paused />);
    rerender(
      <LottieView testID='lottie' animation={animation} paused={false} />,
    );

    expect(reset).toHaveBeenCalledTimes(1);
    expect(resume).toHaveBeenCalledTimes(1);
  });

  describe('speed changes', () => {
    it('re-pauses when nothing has played yet', () => {
      const pause = jest.spyOn(RNLottieView.prototype, 'pause');
      const { rerender } = renderLottie({ autoPlay: false });
      fireEvent(screen.getByTestId('lottie'), 'animationLoaded');

      rerender(
        <LottieView
          testID='lottie'
          animation={animation}
          autoPlay={false}
          speed={2}
        />,
      );
      expect(pause).toHaveBeenCalledTimes(1);
    });

    it('resets a finished animation instead of replaying it', () => {
      const pause = jest.spyOn(RNLottieView.prototype, 'pause');
      const reset = jest.spyOn(RNLottieView.prototype, 'reset');
      const { rerender } = renderLottie();
      fireEvent(screen.getByTestId('lottie'), 'animationLoaded');
      fireEvent(screen.getByTestId('lottie'), 'animationFinish', false);

      rerender(<LottieView testID='lottie' animation={animation} speed={2} />);
      expect(reset).toHaveBeenCalledTimes(1);
      expect(pause).not.toHaveBeenCalled();
    });

    it('leaves a playing animation alone', () => {
      const pause = jest.spyOn(RNLottieView.prototype, 'pause');
      const reset = jest.spyOn(RNLottieView.prototype, 'reset');
      const { rerender } = renderLottie();
      fireEvent(screen.getByTestId('lottie'), 'animationLoaded');

      rerender(<LottieView testID='lottie' animation={animation} speed={2} />);
      expect(pause).not.toHaveBeenCalled();
      expect(reset).not.toHaveBeenCalled();
    });
  });

  it('calls onError with an Error wrapping the native message', () => {
    const onError = jest.fn();
    renderLottie({ onError });
    fireEvent(screen.getByTestId('lottie'), 'animationFailure', 'boom');

    expect(onError).toHaveBeenCalledTimes(1);
    const [error] = onError.mock.calls[0] as [Error];
    expect(error).toBeInstanceOf(Error);
    expect(error.message).toBe('boom');
  });
});
