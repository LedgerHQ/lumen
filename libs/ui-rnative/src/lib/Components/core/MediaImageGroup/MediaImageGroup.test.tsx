import { describe, it, expect } from '@jest/globals';
import { ledgerLiveThemes } from '@ledgerhq/lumen-design-core';
import { render } from '@testing-library/react-native';
import { Text } from 'react-native';
import { ThemeProvider } from '../ThemeProvider/ThemeProvider';
import { MediaImageGroup } from './MediaImageGroup';

const TestWrapper = ({ children }: { children: React.ReactNode }) => (
  <ThemeProvider themes={ledgerLiveThemes} colorScheme='dark' locale='en'>
    {children}
  </ThemeProvider>
);

const items = (count: number) =>
  Array.from({ length: count }, (_, i) => ({
    id: `item-${i}`,
    alt: `item-${i}`,
    fallback: 'A',
  }));

describe('MediaImageGroup', () => {
  describe('Rendering', () => {
    it('should render every item and no badge within maxVisible', () => {
      const { getAllByLabelText, queryByText } = render(
        <TestWrapper>
          <MediaImageGroup data={items(3)} maxVisible={4} />
        </TestWrapper>,
      );

      expect(getAllByLabelText(/^item-/)).toHaveLength(3);
      expect(queryByText(/^\+/)).toBeNull();
    });

    it('should render the overflow badge within the maxVisible budget', () => {
      const { getAllByLabelText, getByText } = render(
        <TestWrapper>
          <MediaImageGroup data={items(10)} maxVisible={4} />
        </TestWrapper>,
      );

      expect(getAllByLabelText(/^item-/)).toHaveLength(3);
      expect(getByText('+7')).toBeTruthy();
    });

    it('should render nothing when data is empty', () => {
      const { toJSON } = render(
        <TestWrapper>
          <MediaImageGroup data={[]} testID='group' />
        </TestWrapper>,
      );

      expect(toJSON()).toBeNull();
    });

    it('should not forward the item id to the rendered media image', () => {
      const { getByLabelText } = render(
        <TestWrapper>
          <MediaImageGroup
            data={[{ id: 'btc', alt: 'Bitcoin', fallback: 'B' }]}
          />
        </TestWrapper>,
      );

      expect(getByLabelText('Bitcoin').props.id).toBeUndefined();
    });
  });

  describe('renderItem', () => {
    it('should pass the group size and shape to renderItem', () => {
      const contexts: unknown[] = [];
      const { getByText } = render(
        <TestWrapper>
          <MediaImageGroup
            data={[{ id: 'btc' }, { id: 'eth' }]}
            size={24}
            shape='square'
            renderItem={(item, context) => {
              contexts.push(context);
              return <Text>{item.id}</Text>;
            }}
          />
        </TestWrapper>,
      );

      expect(getByText('btc')).toBeTruthy();
      expect(getByText('eth')).toBeTruthy();
      expect(contexts).toEqual([
        { size: 24, shape: 'square' },
        { size: 24, shape: 'square' },
      ]);
    });

    it('should only render the visible items', () => {
      const { getByText, queryByText } = render(
        <TestWrapper>
          <MediaImageGroup
            data={Array.from({ length: 6 }, (_, i) => ({ id: `asset-${i}` }))}
            maxVisible={3}
            renderItem={(item) => <Text>{item.id}</Text>}
          />
        </TestWrapper>,
      );

      expect(getByText('asset-0')).toBeTruthy();
      expect(getByText('asset-1')).toBeTruthy();
      expect(queryByText('asset-2')).toBeNull();
      expect(getByText('+4')).toBeTruthy();
    });
  });

  describe('Props', () => {
    it('should forward testID to the root', () => {
      const { getByTestId } = render(
        <TestWrapper>
          <MediaImageGroup data={items(2)} testID='group' />
        </TestWrapper>,
      );

      expect(getByTestId('group')).toBeTruthy();
    });

    it('should forward overflowTestID to the overflow badge', () => {
      const { getByTestId } = render(
        <TestWrapper>
          <MediaImageGroup
            data={items(10)}
            maxVisible={4}
            overflowTestID='overflow'
          />
        </TestWrapper>,
      );

      expect(getByTestId('overflow')).toBeTruthy();
    });
  });
});
