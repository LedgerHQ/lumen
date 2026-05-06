import { describe, expect, it, jest } from '@jest/globals';
import { ledgerLiveThemes } from '@ledgerhq/lumen-design-core';
import { ThemeProvider } from '@ledgerhq/lumen-ui-rnative';
import { render } from '@testing-library/react-native';
import type { ReactNode } from 'react';
import { Text } from 'react-native';

import { CartesianChart } from '../CartesianChart';
import { useScrubberContext } from './context';
import { ScrubberProvider } from './ScrubberProvider';

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
        <CartesianChart series={sampleSeries} width={400} height={200}>
          <ScrubberProvider width={400} height={200} enableScrubbing={true}>
            <Text testID='child'>hello</Text>
          </ScrubberProvider>
        </CartesianChart>
      </Wrapper>,
    );
    expect(getByTestId('child')).toBeTruthy();
  });

  it('renders the long-press + pan gesture overlay when enableScrubbing is true', () => {
    const { getByTestId } = render(
      <Wrapper>
        <CartesianChart series={sampleSeries} width={400} height={200}>
          <ScrubberProvider width={400} height={200} enableScrubbing={true}>
            <Text>child</Text>
          </ScrubberProvider>
        </CartesianChart>
      </Wrapper>,
    );
    expect(getByTestId('scrubber-gesture-overlay')).toBeTruthy();
  });

  it('does not render the gesture overlay when enableScrubbing is false', () => {
    const { queryByTestId } = render(
      <Wrapper>
        <CartesianChart series={sampleSeries} width={400} height={200}>
          <ScrubberProvider width={400} height={200} enableScrubbing={false}>
            <Text>child</Text>
          </ScrubberProvider>
        </CartesianChart>
      </Wrapper>,
    );
    expect(queryByTestId('scrubber-gesture-overlay')).toBeNull();
  });

  it('provides initial scrubberPosition as undefined via context', () => {
    const { getByTestId } = render(
      <Wrapper>
        <CartesianChart series={sampleSeries} width={400} height={200}>
          <ScrubberProvider width={400} height={200} enableScrubbing={true}>
            <ContextConsumer />
          </ScrubberProvider>
        </CartesianChart>
      </Wrapper>,
    );
    expect(getByTestId('context-output').props.children).toBe(
      'enabled:true,pos:none',
    );
  });

  it('calls onScrubberPositionChange when position changes to undefined', () => {
    const onScrubberPositionChange = jest.fn();
    const { getByTestId } = render(
      <Wrapper>
        <CartesianChart series={sampleSeries} width={400} height={200}>
          <ScrubberProvider
            width={400}
            height={200}
            enableScrubbing={true}
            onScrubberPositionChange={onScrubberPositionChange}
          >
            <ContextConsumer />
          </ScrubberProvider>
        </CartesianChart>
      </Wrapper>,
    );
    expect(getByTestId('context-output')).toBeTruthy();
  });
});
