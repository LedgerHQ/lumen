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
  describe('Rendering', () => {
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

  describe('States', () => {
    it('marks the selected segment with accessibilityState', () => {
      const { getByTestId } = render(
        <TestWrapper>
          <SegmentedControl
            selectedValue='receive'
            onSelectedChange={() => {}}
            accessibilityLabel='Transaction type'
          >
            <SegmentedControlButton value='send' testID='seg-send'>
              Send
            </SegmentedControlButton>
            <SegmentedControlButton value='receive' testID='seg-receive'>
              Receive
            </SegmentedControlButton>
          </SegmentedControl>
        </TestWrapper>,
      );

      expect(getByTestId('seg-send').props.accessibilityState).toMatchObject({
        selected: false,
      });
      expect(getByTestId('seg-receive').props.accessibilityState).toMatchObject(
        { selected: true },
      );
    });

    it('marks a pre-selected non-first segment as selected on initial render (fixed layout)', () => {
      const { getByTestId } = render(
        <TestWrapper>
          <SegmentedControl
            selectedValue='blame'
            onSelectedChange={() => {}}
            tabLayout='fixed'
            accessibilityLabel='File view'
          >
            <SegmentedControlButton value='preview' testID='seg-preview'>
              Preview
            </SegmentedControlButton>
            <SegmentedControlButton value='raw' testID='seg-raw'>
              Raw
            </SegmentedControlButton>
            <SegmentedControlButton value='blame' testID='seg-blame'>
              Blame
            </SegmentedControlButton>
          </SegmentedControl>
        </TestWrapper>,
      );

      expect(getByTestId('seg-preview').props.accessibilityState).toMatchObject(
        { selected: false },
      );
      expect(getByTestId('seg-blame').props.accessibilityState).toMatchObject({
        selected: true,
      });
    });

    it('marks a pre-selected non-first segment as selected on initial render (fit layout)', () => {
      const { getByTestId } = render(
        <TestWrapper>
          <SegmentedControl
            selectedValue='blame'
            onSelectedChange={() => {}}
            tabLayout='fit'
            accessibilityLabel='File view'
          >
            <SegmentedControlButton value='preview' testID='seg-preview'>
              Preview
            </SegmentedControlButton>
            <SegmentedControlButton value='raw' testID='seg-raw'>
              Raw
            </SegmentedControlButton>
            <SegmentedControlButton value='blame' testID='seg-blame'>
              Blame
            </SegmentedControlButton>
          </SegmentedControl>
        </TestWrapper>,
      );

      expect(getByTestId('seg-preview').props.accessibilityState).toMatchObject(
        { selected: false },
      );
      expect(getByTestId('seg-blame').props.accessibilityState).toMatchObject({
        selected: true,
      });
    });

    it('can change selection away from a pre-selected non-first segment (fit layout)', () => {
      const onSelectedChange = jest.fn();
      const { getByText } = render(
        <TestWrapper>
          <SegmentedControl
            selectedValue='blame'
            onSelectedChange={onSelectedChange}
            tabLayout='fit'
            accessibilityLabel='File view'
          >
            <SegmentedControlButton value='preview'>
              Preview
            </SegmentedControlButton>
            <SegmentedControlButton value='raw'>Raw</SegmentedControlButton>
            <SegmentedControlButton value='blame'>Blame</SegmentedControlButton>
          </SegmentedControl>
        </TestWrapper>,
      );

      fireEvent.press(getByText('Preview'));

      expect(onSelectedChange).toHaveBeenCalledWith('preview');
    });
  });
});
