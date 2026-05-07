import { describe, it, expect, jest } from '@jest/globals';
import { ledgerLiveThemes } from '@ledgerhq/lumen-design-core';
import { render, fireEvent } from '@testing-library/react-native';
import { DotCount } from '../DotCount';
import { ThemeProvider } from '../ThemeProvider/ThemeProvider';
import { SegmentedControl, SegmentedControlButton } from './SegmentedControl';

const TestWrapper = ({ children }: { children: React.ReactNode }) => (
  <ThemeProvider themes={ledgerLiveThemes} colorScheme='dark' locale='en'>
    {children}
  </ThemeProvider>
);

describe('SegmentedControl', () => {
  it('renders segments with labels', () => {
    const { getByText } = render(
      <TestWrapper>
        <SegmentedControl
          selectedValue='send'
          onSelectedChange={() => {
            /* empty */
          }}
          accessibilityLabel='Transaction type'
        >
          <SegmentedControlButton value='send'>Send</SegmentedControlButton>
          <SegmentedControlButton value='receive'>
            Receive
          </SegmentedControlButton>
        </SegmentedControl>
      </TestWrapper>,
    );
    expect(getByText('Send')).toBeTruthy();
    expect(getByText('Receive')).toBeTruthy();
  });

  it('calls onSelectedChange with segment value when a segment is pressed', () => {
    const onSelectedChange = jest.fn();
    const { getByText } = render(
      <TestWrapper>
        <SegmentedControl
          selectedValue='send'
          onSelectedChange={onSelectedChange}
          accessibilityLabel='Transaction type'
        >
          <SegmentedControlButton value='send'>Send</SegmentedControlButton>
          <SegmentedControlButton value='receive'>
            Receive
          </SegmentedControlButton>
        </SegmentedControl>
      </TestWrapper>,
    );

    fireEvent.press(getByText('Receive'));

    expect(onSelectedChange).toHaveBeenCalledWith('receive');
  });

  it('renders trailingContent inside segment buttons', () => {
    const { getByLabelText } = render(
      <TestWrapper>
        <SegmentedControl
          selectedValue='tokens'
          onSelectedChange={() => {
            /* empty */
          }}
          accessibilityLabel='Asset section'
        >
          <SegmentedControlButton
            value='tokens'
            trailingContent={
              <DotCount value={3} accessibilityLabel='3 tokens' />
            }
          >
            Tokens
          </SegmentedControlButton>
          <SegmentedControlButton value='nfts'>NFTs</SegmentedControlButton>
        </SegmentedControl>
      </TestWrapper>,
    );

    expect(getByLabelText('3 tokens')).toBeTruthy();
  });
});
