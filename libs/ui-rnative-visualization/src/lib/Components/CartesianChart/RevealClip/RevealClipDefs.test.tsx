import { describe, it, expect } from '@jest/globals';
import { ledgerLiveThemes } from '@ledgerhq/lumen-design-core';
import { ThemeProvider } from '@ledgerhq/lumen-ui-rnative';
import { render } from '@testing-library/react-native';
import { Svg } from 'react-native-svg';

import type { DrawingArea, Series } from '../../../utils/types';
import { OVERFLOW_BUFFER } from '../utils';

import { useRevealClip } from './context';
import { RevealClipDefs } from './RevealClipDefs';

const drawingArea: DrawingArea = {
  x: 10,
  y: 10,
  width: 380,
  height: 180,
};

const series: Series[] = [{ id: 'a', stroke: '#000', data: [1, 2, 3] }];

function ClipConsumer() {
  const clipPath = useRevealClip();
  return <Svg testID='consumer' clipPath={clipPath} />;
}

const renderInSvg = (ui: React.ReactElement) =>
  render(
    <ThemeProvider themes={ledgerLiveThemes} colorScheme='light'>
      <Svg>{ui}</Svg>
    </ThemeProvider>,
  );

describe('RevealClipDefs', () => {
  it('renders children', () => {
    const { getByTestId } = renderInSvg(
      <RevealClipDefs
        drawingArea={drawingArea}
        series={series}
        transitions={{ enter: { duration: 0.5 } }}
      >
        <Svg testID='child' />
      </RevealClipDefs>,
    );

    expect(getByTestId('child')).toBeTruthy();
  });

  it('renders a ClipPath with a Rect when animate is true', () => {
    const { UNSAFE_root } = renderInSvg(
      <RevealClipDefs
        drawingArea={drawingArea}
        series={series}
        transitions={{ enter: { duration: 0.5 } }}
      >
        <Svg testID='child' />
      </RevealClipDefs>,
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

  it('provides clipPathAttr to consumers via context', () => {
    const { UNSAFE_root } = renderInSvg(
      <RevealClipDefs
        drawingArea={drawingArea}
        series={series}
        transitions={{ enter: { duration: 0.5 } }}
      >
        <ClipConsumer />
      </RevealClipDefs>,
    );

    const consumer = UNSAFE_root.findByProps({ testID: 'consumer' });
    expect(consumer.props.clipPath).toMatch(/^url\(#/);
  });

  it('skips ClipPath when animate is false', () => {
    const { UNSAFE_root, getByTestId } = renderInSvg(
      <RevealClipDefs drawingArea={drawingArea} series={series} animate={false}>
        <Svg testID='child' />
      </RevealClipDefs>,
    );

    expect(getByTestId('child')).toBeTruthy();

    const clipPaths = UNSAFE_root.findAllByType('ClipPath' as any);
    expect(clipPaths).toHaveLength(0);
  });

  it('does not provide clipPathAttr when animate is false', () => {
    const { UNSAFE_root } = renderInSvg(
      <RevealClipDefs drawingArea={drawingArea} series={series} animate={false}>
        <ClipConsumer />
      </RevealClipDefs>,
    );

    const consumer = UNSAFE_root.findByProps({ testID: 'consumer' });
    expect(consumer.props.clipPath).toBeUndefined();
  });

  it('renders without crashing when transitions.enter is not defined', () => {
    const { UNSAFE_root, getByTestId } = renderInSvg(
      <RevealClipDefs
        drawingArea={drawingArea}
        series={series}
        transitions={{}}
      >
        <Svg testID='child' />
      </RevealClipDefs>,
    );

    expect(getByTestId('child')).toBeTruthy();

    const clipPaths = UNSAFE_root.findAllByType('ClipPath' as any);
    expect(clipPaths.length).toBeGreaterThan(0);
  });
});
