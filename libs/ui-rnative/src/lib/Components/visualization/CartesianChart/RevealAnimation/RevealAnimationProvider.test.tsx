import { describe, it, expect } from '@jest/globals';
import { ledgerLiveThemes } from '@ledgerhq/lumen-design-core';
import { ThemeProvider } from '@ledgerhq/lumen-ui-rnative';
import { render } from '@testing-library/react-native';
import { Svg } from 'react-native-svg';

import type { DrawingArea, Series } from '../../../utils/types';
import { OVERFLOW_BUFFER } from '../utils';

import { usePathReveal, usePointReveal } from './context';
import { RevealAnimationProvider } from './RevealAnimationProvider';

const drawingArea: DrawingArea = {
  x: 10,
  y: 10,
  width: 380,
  height: 180,
};

const series: Series[] = [{ id: 'a', stroke: '#000', data: [1, 2, 3] }];

function ClipConsumer() {
  const clipPath = usePathReveal();
  return <Svg testID='consumer' clipPath={clipPath} />;
}

function PointConsumer() {
  const pointOpacity = usePointReveal();
  return <Svg testID='point-consumer' opacity={pointOpacity ? 1 : 0} />;
}

const renderInSvg = (ui: React.ReactElement) =>
  render(
    <ThemeProvider themes={ledgerLiveThemes} colorScheme='light'>
      <Svg>{ui}</Svg>
    </ThemeProvider>,
  );

describe('RevealAnimationProvider', () => {
  it('renders children', () => {
    const { getByTestId } = renderInSvg(
      <RevealAnimationProvider
        drawingArea={drawingArea}
        series={series}
        transitions={{ enter: { duration: 0.5 } }}
      >
        <Svg testID='child' />
      </RevealAnimationProvider>,
    );

    expect(getByTestId('child')).toBeTruthy();
  });

  it('renders a ClipPath with a Rect when animate is true', () => {
    const { UNSAFE_root } = renderInSvg(
      <RevealAnimationProvider
        drawingArea={drawingArea}
        series={series}
        transitions={{ enter: { duration: 0.5 } }}
      >
        <Svg testID='child' />
      </RevealAnimationProvider>,
    );

    const clipPaths = UNSAFE_root.findAllByType('ClipPath' as any);
    expect(clipPaths.length).toBeGreaterThan(0);

    const rects = clipPaths[0].findAllByType('Rect' as any);
    expect(rects.length).toBeGreaterThan(0);

    const rect = rects[0];
    expect(rect.props.x).toBe(drawingArea.x - OVERFLOW_BUFFER.left);
    expect(rect.props.y).toBe(drawingArea.y - OVERFLOW_BUFFER.top);
    expect(rect.props.height).toBe(
      drawingArea.height + OVERFLOW_BUFFER.top + OVERFLOW_BUFFER.bottom,
    );
  });

  it('provides clipPathAttr to consumers via usePathReveal', () => {
    const { UNSAFE_root } = renderInSvg(
      <RevealAnimationProvider
        drawingArea={drawingArea}
        series={series}
        transitions={{ enter: { duration: 0.5 } }}
      >
        <ClipConsumer />
      </RevealAnimationProvider>,
    );

    const consumer = UNSAFE_root.findByProps({ testID: 'consumer' });
    expect(consumer.props.clipPath).toMatch(/^url\(#/);
  });

  it('provides a point opacity shared value via usePointReveal', () => {
    const { UNSAFE_root } = renderInSvg(
      <RevealAnimationProvider
        drawingArea={drawingArea}
        series={series}
        transitions={{ enter: { duration: 0.5 } }}
      >
        <PointConsumer />
      </RevealAnimationProvider>,
    );

    const consumer = UNSAFE_root.findByProps({ testID: 'point-consumer' });
    expect(consumer.props.opacity).toBe(1);
  });

  it('skips ClipPath when animate is false', () => {
    const { UNSAFE_root, getByTestId } = renderInSvg(
      <RevealAnimationProvider
        drawingArea={drawingArea}
        series={series}
        animate={false}
      >
        <Svg testID='child' />
      </RevealAnimationProvider>,
    );

    expect(getByTestId('child')).toBeTruthy();

    const clipPaths = UNSAFE_root.findAllByType('ClipPath' as any);
    expect(clipPaths).toHaveLength(0);
  });

  it('does not provide clipPathAttr when animate is false', () => {
    const { UNSAFE_root } = renderInSvg(
      <RevealAnimationProvider
        drawingArea={drawingArea}
        series={series}
        animate={false}
      >
        <ClipConsumer />
      </RevealAnimationProvider>,
    );

    const consumer = UNSAFE_root.findByProps({ testID: 'consumer' });
    expect(consumer.props.clipPath).toBeUndefined();
  });

  it('does not provide a point opacity value when animate is false', () => {
    const { UNSAFE_root } = renderInSvg(
      <RevealAnimationProvider
        drawingArea={drawingArea}
        series={series}
        animate={false}
      >
        <PointConsumer />
      </RevealAnimationProvider>,
    );

    const consumer = UNSAFE_root.findByProps({ testID: 'point-consumer' });
    expect(consumer.props.opacity).toBe(0);
  });

  it('renders without crashing when transitions.enter is not defined', () => {
    const { UNSAFE_root, getByTestId } = renderInSvg(
      <RevealAnimationProvider
        drawingArea={drawingArea}
        series={series}
        transitions={{}}
      >
        <Svg testID='child' />
      </RevealAnimationProvider>,
    );

    expect(getByTestId('child')).toBeTruthy();

    const clipPaths = UNSAFE_root.findAllByType('ClipPath' as any);
    expect(clipPaths.length).toBeGreaterThan(0);
  });
});
