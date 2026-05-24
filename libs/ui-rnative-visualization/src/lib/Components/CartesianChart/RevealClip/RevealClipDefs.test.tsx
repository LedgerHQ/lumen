import { describe, it, expect } from '@jest/globals';
import { render } from '@testing-library/react-native';
import { Text, View } from 'react-native';
import { ClipPath, Svg } from 'react-native-svg';

import type { DrawingArea, Series } from '../../../utils/types';

import { useRevealClip } from './context';
import { RevealClipDefs } from './RevealClipDefs';

const series: Series[] = [{ id: 'a', stroke: '#000', data: [1, 2, 3] }];

const drawingArea: DrawingArea = { x: 50, y: 50, width: 300, height: 100 };

// Probe used to observe what useRevealClip() returns at render time without
// having to inspect the rendered tree directly.
const ClipProbe = ({ testID }: { testID: string }) => {
  const clip = useRevealClip();
  return <Text testID={testID}>{clip ?? 'none'}</Text>;
};

describe('RevealClipDefs', () => {
  it('renders children', () => {
    const { getByTestId } = render(
      <Svg>
        <RevealClipDefs
          drawingArea={drawingArea}
          series={series}
          transitions={{ enter: { duration: 0.5 } }}
        >
          <View testID='child' />
        </RevealClipDefs>
      </Svg>,
    );

    expect(getByTestId('child')).toBeTruthy();
  });

  it('renders a ClipPath whose id contains no colons (Android url(#...) safety)', () => {
    const { UNSAFE_getAllByType } = render(
      <Svg>
        <RevealClipDefs
          drawingArea={drawingArea}
          series={series}
          transitions={{ enter: { duration: 0.5 } }}
        >
          <View testID='child' />
        </RevealClipDefs>
      </Svg>,
    );

    const clipPaths = UNSAFE_getAllByType(ClipPath);
    expect(clipPaths.length).toBeGreaterThan(0);

    const id = clipPaths[0].props.id as string;
    expect(id).toBeTruthy();
    expect(id).not.toContain(':');
  });

  it('exposes a url(#...) reference via useRevealClip when animate is true', () => {
    const { getByTestId } = render(
      <Svg>
        <RevealClipDefs drawingArea={drawingArea} series={series}>
          <ClipProbe testID='probe' />
        </RevealClipDefs>
      </Svg>,
    );

    const probe = getByTestId('probe');
    const value = probe.props.children as string;
    expect(value).toMatch(/^url\(#[^:]+\)$/);
  });

  it('renders children with no clipPath in context when animate is false', () => {
    const { getByTestId } = render(
      <Svg>
        <RevealClipDefs
          drawingArea={drawingArea}
          series={series}
          animate={false}
        >
          <ClipProbe testID='probe' />
        </RevealClipDefs>
      </Svg>,
    );

    const probe = getByTestId('probe');
    expect(probe.props.children).toBe('none');
  });

  it('does not render a ClipPath when animate is false', () => {
    const { UNSAFE_queryAllByType } = render(
      <Svg>
        <RevealClipDefs
          drawingArea={drawingArea}
          series={series}
          animate={false}
        >
          <View testID='child' />
        </RevealClipDefs>
      </Svg>,
    );

    const clipPaths = UNSAFE_queryAllByType(ClipPath);
    expect(clipPaths).toHaveLength(0);
  });

  it('renders without crashing when transitions.enter is not defined', () => {
    const { getByTestId } = render(
      <Svg>
        <RevealClipDefs
          drawingArea={drawingArea}
          series={series}
          transitions={{}}
        >
          <View testID='child' />
        </RevealClipDefs>
      </Svg>,
    );

    expect(getByTestId('child')).toBeTruthy();
  });
});
