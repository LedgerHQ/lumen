import { describe, it, expect } from '@jest/globals';
import { ledgerLiveThemes } from '@ledgerhq/lumen-design-core';
import { ThemeProvider } from '@ledgerhq/lumen-ui-rnative';
import { render } from '@testing-library/react-native';
import { Svg } from 'react-native-svg';

import type { DrawingArea, Series } from '../../../utils/types';

import { RevealClipDefs } from './RevealClipDefs';

const drawingArea: DrawingArea = {
  x: 10,
  y: 10,
  width: 380,
  height: 180,
};

const series: Series[] = [{ id: 'a', stroke: '#000', data: [1, 2, 3] }];

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

  it('renders without crashing when animate is false', () => {
    const { getByTestId } = renderInSvg(
      <RevealClipDefs drawingArea={drawingArea} series={series} animate={false}>
        <Svg testID='child' />
      </RevealClipDefs>,
    );

    expect(getByTestId('child')).toBeTruthy();
  });

  it('renders without crashing when transitions.enter is null', () => {
    const { getByTestId } = renderInSvg(
      <RevealClipDefs
        drawingArea={drawingArea}
        series={series}
        transitions={{ enter: null }}
      >
        <Svg testID='child' />
      </RevealClipDefs>,
    );

    expect(getByTestId('child')).toBeTruthy();
  });
});
