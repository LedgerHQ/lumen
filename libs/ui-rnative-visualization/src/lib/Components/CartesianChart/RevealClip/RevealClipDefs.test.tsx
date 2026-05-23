import { describe, it, expect } from '@jest/globals';
import { render } from '@testing-library/react-native';
import { View, Text } from 'react-native';

import type { Series } from '../../../utils/types';

import { RevealClipDefs } from './RevealClipDefs';

const series: Series[] = [{ id: 'a', stroke: '#000', data: [1, 2, 3] }];

describe('RevealClipDefs', () => {
  it('renders children', () => {
    const { getByTestId } = render(
      <RevealClipDefs
        width={400}
        height={200}
        series={series}
        transitions={{ enter: { duration: 0.5 } }}
      >
        <View testID='child' />
      </RevealClipDefs>,
    );

    expect(getByTestId('child')).toBeTruthy();
  });

  it('wraps children in an animated view when animate is true', () => {
    const { toJSON } = render(
      <RevealClipDefs
        width={400}
        height={200}
        series={series}
        transitions={{ enter: { duration: 0.5 } }}
      >
        <Text>chart content</Text>
      </RevealClipDefs>,
    );

    const tree = toJSON();
    expect(tree).not.toBeNull();
    expect(tree?.type).toBe('View');
  });

  it('renders children directly when animate is false', () => {
    const { getByTestId, toJSON } = render(
      <RevealClipDefs width={400} height={200} series={series} animate={false}>
        <View testID='child' />
      </RevealClipDefs>,
    );

    expect(getByTestId('child')).toBeTruthy();
    const tree = toJSON();
    expect(tree?.props.style).toBeUndefined();
  });

  it('renders without crashing when transitions.enter is not defined', () => {
    const { getByTestId } = render(
      <RevealClipDefs
        width={400}
        height={200}
        series={series}
        transitions={{}}
      >
        <View testID='child' />
      </RevealClipDefs>,
    );

    expect(getByTestId('child')).toBeTruthy();
  });
});
