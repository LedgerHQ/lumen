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

const createWrapper =
  (colorScheme: 'light' | 'dark') =>
  ({ children }: { children: ReactNode }) => (
    <ThemeProvider themes={ledgerLiveThemes} colorScheme={colorScheme}>
      {children}
    </ThemeProvider>
  );

const renderLottie = (
  props: Partial<Parameters<typeof LottieView>[0]> = {},
  colorScheme: 'light' | 'dark' = 'dark',
) =>
  render(<LottieView testID='lottie' animation={animation} {...props} />, {
    wrapper: createWrapper(colorScheme),
  });

const spyOn = (method: 'pause' | 'resume' | 'reset') =>
  jest.spyOn(RNLottieView.prototype, method);

describe('LottieView', () => {
  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('plays the variant matching the theme', () => {
    renderLottie({}, 'light');
    expect(screen.getByTestId('lottie').props.source).toBe(animation.light);
  });

  it('plays the forced color scheme over the theme', () => {
    renderLottie({ colorScheme: 'light' }, 'dark');
    expect(screen.getByTestId('lottie').props.source).toBe(animation.light);
  });

  it('plays a single source whatever the theme', () => {
    const source = { uri: 'https://example.com/single.lottie' };
    renderLottie({ animation: source }, 'light');
    expect(screen.getByTestId('lottie').props.source).toBe(source);
  });

  it('applies the playback defaults', () => {
    renderLottie();
    const lottie = screen.getByTestId('lottie');
    expect(lottie.props.autoPlay).toBe(true);
    expect(lottie.props.loop).toBe(false);
    expect(lottie.props.speed).toBe(1);
  });

  it('does not autoplay when initially paused', () => {
    renderLottie({ paused: true });
    expect(screen.getByTestId('lottie').props.autoPlay).toBe(false);
  });

  it('pauses and resumes when `paused` changes', () => {
    const pause = spyOn('pause');
    const resume = spyOn('resume');
    const { rerender } = renderLottie();
    expect(pause).not.toHaveBeenCalled();

    rerender(<LottieView testID='lottie' animation={animation} paused />);
    expect(pause).toHaveBeenCalledTimes(1);

    rerender(
      <LottieView testID='lottie' animation={animation} paused={false} />,
    );
    expect(resume).toHaveBeenCalledTimes(1);
  });

  it('calls onComplete only when the animation is not canceled', () => {
    const onComplete = jest.fn();
    renderLottie({ onComplete });
    const lottie = screen.getByTestId('lottie');

    fireEvent(lottie, 'animationFinish', true);
    expect(onComplete).not.toHaveBeenCalled();

    fireEvent(lottie, 'animationFinish', false);
    expect(onComplete).toHaveBeenCalledTimes(1);
  });

  it('replays each loop from JS when onLoop is set', () => {
    const onLoop = jest.fn();
    const onComplete = jest.fn();
    const reset = spyOn('reset');
    const resume = spyOn('resume');
    renderLottie({ loop: true, onLoop, onComplete });
    const lottie = screen.getByTestId('lottie');
    expect(lottie.props.loop).toBe(false);

    fireEvent(lottie, 'animationFinish', false);
    expect(onLoop).toHaveBeenCalledTimes(1);
    expect(onComplete).not.toHaveBeenCalled();
    expect(reset).toHaveBeenCalledTimes(1);
    expect(resume).toHaveBeenCalledTimes(1);
  });

  it('keeps native looping when onLoop is not set', () => {
    renderLottie({ loop: true });
    expect(screen.getByTestId('lottie').props.loop).toBe(true);
  });

  it('forwards load and wraps failures in an Error', () => {
    const onLoad = jest.fn();
    const onError = jest.fn<(error: Error) => void>();
    renderLottie({ onLoad, onError });
    const lottie = screen.getByTestId('lottie');

    fireEvent(lottie, 'animationLoaded');
    expect(onLoad).toHaveBeenCalledTimes(1);

    fireEvent(lottie, 'animationFailure', 'bad json');
    expect(onError.mock.calls[0][0]).toBeInstanceOf(Error);
    expect(onError.mock.calls[0][0].message).toBe('bad json');
  });

  it('exposes play, pause and stop through the ref', () => {
    const pause = spyOn('pause');
    const resume = spyOn('resume');
    const reset = spyOn('reset');
    const ref = createRef<LottieViewRef>();
    renderLottie({ ref });

    act(() => ref.current?.pause());
    expect(pause).toHaveBeenCalledTimes(1);

    act(() => ref.current?.play());
    expect(resume).toHaveBeenCalledTimes(1);
    expect(reset).not.toHaveBeenCalled();

    act(() => ref.current?.stop());
    expect(reset).toHaveBeenCalledTimes(1);
  });

  it('rewinds before playing again once completed', () => {
    const reset = spyOn('reset');
    const resume = spyOn('resume');
    const ref = createRef<LottieViewRef>();
    renderLottie({ ref });

    fireEvent(screen.getByTestId('lottie'), 'animationFinish', false);
    act(() => ref.current?.play());

    expect(reset).toHaveBeenCalledTimes(1);
    expect(resume).toHaveBeenCalledTimes(1);
  });

  it('resumes without rewinding after the source changes', () => {
    const reset = spyOn('reset');
    const resume = spyOn('resume');
    const ref = createRef<LottieViewRef>();
    const { rerender } = renderLottie({ ref });

    fireEvent(screen.getByTestId('lottie'), 'animationFinish', false);
    rerender(
      <LottieView
        ref={ref}
        testID='lottie'
        animation={{ light: 2, dark: 3 }}
      />,
    );
    act(() => ref.current?.play());

    expect(reset).not.toHaveBeenCalled();
    expect(resume).toHaveBeenCalledTimes(1);
  });

  it('resolves lx into the style', () => {
    renderLottie({ lx: { width: 's80' } });
    expect(screen.getByTestId('lottie').props.style).toMatchObject({
      width: 80,
    });
  });
});
