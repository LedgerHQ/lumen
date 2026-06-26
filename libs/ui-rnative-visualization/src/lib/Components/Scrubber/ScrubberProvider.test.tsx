import { beforeEach, describe, expect, it, jest } from '@jest/globals';
import { ledgerLiveThemes } from '@ledgerhq/lumen-design-core';
import { ThemeProvider } from '@ledgerhq/lumen-ui-rnative';
import { fireEvent, render } from '@testing-library/react-native';
import * as Haptics from 'expo-haptics';
import type { ReactNode } from 'react';
import { Pressable, Text } from 'react-native';

import { CartesianChart } from '../CartesianChart';
import { useScrubberContext } from './context';

const impactAsyncMock = jest.mocked(Haptics.impactAsync);

const sampleSeries = [
  { id: 's1', stroke: '#7B61FF', data: [10, 20, 30, 40, 50] },
];

const Wrapper = ({ children }: { children: ReactNode }) => (
  <ThemeProvider themes={ledgerLiveThemes} colorScheme='light'>
    {children}
  </ThemeProvider>
);

const ContextConsumer = () => {
  const { scrubberPosition, enableScrubbing } = useScrubberContext();
  return (
    <Text testID='context-output'>
      {`enabled:${enableScrubbing},pos:${scrubberPosition ?? 'none'}`}
    </Text>
  );
};

describe('ScrubberProvider', () => {
  it('renders children', () => {
    const { getByTestId } = render(
      <Wrapper>
        <CartesianChart
          series={sampleSeries}
          width={400}
          height={200}
          enableScrubbing={true}
        >
          <Text testID='child'>hello</Text>
        </CartesianChart>
      </Wrapper>,
    );
    expect(getByTestId('child')).toBeTruthy();
  });

  it('renders the long-press + pan gesture overlay when enableScrubbing is true', () => {
    const { getByTestId } = render(
      <Wrapper>
        <CartesianChart
          series={sampleSeries}
          width={400}
          height={200}
          enableScrubbing={true}
        >
          <Text>child</Text>
        </CartesianChart>
      </Wrapper>,
    );
    expect(getByTestId('scrubber-gesture-overlay')).toBeTruthy();
  });

  it('does not render the gesture overlay when enableScrubbing is false', () => {
    const { queryByTestId } = render(
      <Wrapper>
        <CartesianChart
          series={sampleSeries}
          width={400}
          height={200}
          enableScrubbing={false}
        >
          <Text>child</Text>
        </CartesianChart>
      </Wrapper>,
    );
    expect(queryByTestId('scrubber-gesture-overlay')).toBeNull();
  });

  it('provides initial scrubberPosition as undefined via context', () => {
    const { getByTestId } = render(
      <Wrapper>
        <CartesianChart
          series={sampleSeries}
          width={400}
          height={200}
          enableScrubbing={true}
        >
          <ContextConsumer />
        </CartesianChart>
      </Wrapper>,
    );
    expect(getByTestId('context-output').props.children).toBe(
      'enabled:true,pos:none',
    );
  });

  it('calls onScrubberPositionChange when position is updated via context', () => {
    const onScrubberPositionChange = jest.fn();

    const ContextTrigger = () => {
      const { onScrubberPositionChange: updatePosition } = useScrubberContext();
      return (
        <>
          <Pressable testID='set-position' onPress={() => updatePosition(2)} />
          <Pressable
            testID='clear-position'
            onPress={() => updatePosition(undefined)}
          />
        </>
      );
    };

    const { getByTestId } = render(
      <Wrapper>
        <CartesianChart
          series={sampleSeries}
          width={400}
          height={200}
          enableScrubbing={true}
          onScrubberPositionChange={onScrubberPositionChange}
        >
          <ContextTrigger />
        </CartesianChart>
      </Wrapper>,
    );

    fireEvent.press(getByTestId('set-position'));
    expect(onScrubberPositionChange).toHaveBeenCalledWith(2);

    fireEvent.press(getByTestId('clear-position'));
    expect(onScrubberPositionChange).toHaveBeenCalledWith(undefined);
    expect(onScrubberPositionChange).toHaveBeenCalledTimes(2);
  });

  it('does not fire onScrubberPositionChange when the index is unchanged', () => {
    const onScrubberPositionChange = jest.fn();

    const ContextTrigger = () => {
      const { onScrubberPositionChange: updatePosition } = useScrubberContext();
      return (
        <Pressable testID='set-position' onPress={() => updatePosition(2)} />
      );
    };

    const { getByTestId } = render(
      <Wrapper>
        <CartesianChart
          series={sampleSeries}
          width={400}
          height={200}
          enableScrubbing={true}
          onScrubberPositionChange={onScrubberPositionChange}
        >
          <ContextTrigger />
        </CartesianChart>
      </Wrapper>,
    );

    fireEvent.press(getByTestId('set-position'));
    fireEvent.press(getByTestId('set-position'));
    fireEvent.press(getByTestId('set-position'));
    expect(onScrubberPositionChange).toHaveBeenCalledTimes(1);
  });

  it('clamps out-of-range index set via context', () => {
    const onScrubberPositionChange = jest.fn();

    const ContextTrigger = () => {
      const { onScrubberPositionChange: updatePosition } = useScrubberContext();
      return (
        <Pressable testID='set-position' onPress={() => updatePosition(999)} />
      );
    };

    const { getByTestId } = render(
      <Wrapper>
        <CartesianChart
          series={sampleSeries}
          width={400}
          height={200}
          enableScrubbing={true}
          onScrubberPositionChange={onScrubberPositionChange}
        >
          <ContextTrigger />
        </CartesianChart>
      </Wrapper>,
    );

    fireEvent.press(getByTestId('set-position'));
    expect(onScrubberPositionChange).toHaveBeenCalledWith(
      sampleSeries[0].data.length - 1,
    );
  });

  it('does not fire callback when dataLength is 0', () => {
    const onScrubberPositionChange = jest.fn();
    const emptySeries = [{ id: 's1', stroke: '#7B61FF', data: [] as number[] }];

    const ContextTrigger = () => {
      const { onScrubberPositionChange: updatePosition } = useScrubberContext();
      return (
        <Pressable testID='set-position' onPress={() => updatePosition(0)} />
      );
    };

    const { getByTestId } = render(
      <Wrapper>
        <CartesianChart
          series={emptySeries}
          width={400}
          height={200}
          enableScrubbing={true}
          onScrubberPositionChange={onScrubberPositionChange}
        >
          <ContextTrigger />
        </CartesianChart>
      </Wrapper>,
    );

    fireEvent.press(getByTestId('set-position'));
    expect(onScrubberPositionChange).not.toHaveBeenCalled();
  });

  describe('haptic feedback', () => {
    const ContextTrigger = () => {
      const { onScrubberPositionChange: updatePosition } = useScrubberContext();
      return (
        <>
          <Pressable testID='enter' onPress={() => updatePosition(2)} />
          <Pressable testID='move' onPress={() => updatePosition(3)} />
          <Pressable testID='exit' onPress={() => updatePosition(undefined)} />
        </>
      );
    };

    const renderTrigger = (series = sampleSeries) =>
      render(
        <Wrapper>
          <CartesianChart
            series={series}
            width={400}
            height={200}
            enableScrubbing={true}
          >
            <ContextTrigger />
          </CartesianChart>
        </Wrapper>,
      );

    beforeEach(() => {
      impactAsyncMock.mockClear();
    });

    it('triggers light haptic feedback once when entering from idle', () => {
      const { getByTestId } = renderTrigger();

      fireEvent.press(getByTestId('enter'));

      expect(impactAsyncMock).toHaveBeenCalledTimes(1);
      expect(impactAsyncMock).toHaveBeenCalledWith('light');
    });

    it('does not re-trigger haptic feedback while moving between indices', () => {
      const { getByTestId } = renderTrigger();

      fireEvent.press(getByTestId('enter'));
      fireEvent.press(getByTestId('move'));

      expect(impactAsyncMock).toHaveBeenCalledTimes(1);
    });

    it('does not trigger haptic feedback when exiting the scrubber', () => {
      const { getByTestId } = renderTrigger();

      fireEvent.press(getByTestId('enter'));
      fireEvent.press(getByTestId('exit'));

      expect(impactAsyncMock).toHaveBeenCalledTimes(1);
    });

    it('re-triggers haptic feedback when re-entering after an exit', () => {
      const { getByTestId } = renderTrigger();

      fireEvent.press(getByTestId('enter'));
      fireEvent.press(getByTestId('exit'));
      fireEvent.press(getByTestId('move'));

      expect(impactAsyncMock).toHaveBeenCalledTimes(2);
    });

    it('does not trigger haptic feedback when dataLength is 0', () => {
      const emptySeries = [
        { id: 's1', stroke: '#7B61FF', data: [] as number[] },
      ];
      const { getByTestId } = renderTrigger(emptySeries);

      fireEvent.press(getByTestId('enter'));

      expect(impactAsyncMock).not.toHaveBeenCalled();
    });
  });
});
