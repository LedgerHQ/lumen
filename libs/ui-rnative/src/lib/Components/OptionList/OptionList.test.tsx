import { describe, it, expect, jest } from '@jest/globals';
import { ledgerLiveThemes } from '@ledgerhq/lumen-design-core';
import { render, fireEvent } from '@testing-library/react-native';
import { Text } from 'react-native';
import { ThemeProvider } from '../ThemeProvider/ThemeProvider';
import {
  OptionList,
  OptionListContent,
  OptionListItem,
  OptionListItemContent,
  OptionListItemContentRow,
  OptionListItemLeading,
  OptionListItemText,
  OptionListItemDescription,
  OptionListEmptyState,
  OptionListSearch,
  OptionListTrigger,
  createOptionList,
} from './OptionList';
import type { OptionListItemData } from './types';

const TestWrapper = ({ children }: { children: React.ReactNode }) => (
  <ThemeProvider themes={ledgerLiveThemes} colorScheme='dark' locale='en'>
    {children}
  </ThemeProvider>
);

const ITEMS: OptionListItemData[] = [
  { value: 'a', label: 'Alpha' },
  { value: 'b', label: 'Beta' },
  { value: 'c', label: 'Gamma' },
];

const GROUPED_ITEMS: OptionListItemData[] = [
  { value: 'apple', label: 'Apple', group: 'Fruits' },
  { value: 'banana', label: 'Banana', group: 'Fruits' },
  { value: 'carrot', label: 'Carrot', group: 'Vegetables' },
];

const renderOptionList = ({
  items = ITEMS,
  value,
  defaultValue,
  onValueChange,
  disabled,
}: {
  items?: OptionListItemData[];
  value?: string | null;
  defaultValue?: string | null;
  onValueChange?: (v: string | null) => void;
  disabled?: boolean;
} = {}) =>
  render(
    <TestWrapper>
      <OptionList
        items={items}
        value={value}
        defaultValue={defaultValue}
        onValueChange={onValueChange}
        disabled={disabled}
      >
        <OptionListContent
          renderItem={(item) => (
            <OptionListItem value={item.value} disabled={item.disabled}>
              <OptionListItemContent>
                <OptionListItemText>{item.label}</OptionListItemText>
              </OptionListItemContent>
            </OptionListItem>
          )}
        />
      </OptionList>
    </TestWrapper>,
  );

describe('OptionList', () => {
  it('renders all items', () => {
    const { getByText } = renderOptionList();

    expect(getByText('Alpha')).toBeTruthy();
    expect(getByText('Beta')).toBeTruthy();
    expect(getByText('Gamma')).toBeTruthy();
  });

  it('calls onValueChange when an item is pressed', () => {
    const onValueChange = jest.fn();
    const { getByText } = renderOptionList({ onValueChange });

    fireEvent.press(getByText('Beta'));

    expect(onValueChange).toHaveBeenCalledWith('b');
  });

  it('marks the selected item with accessibilityState', () => {
    const { getAllByRole } = renderOptionList({ value: 'a' });

    const items = getAllByRole('radio');
    const selectedItem = items.find(
      (i) => i.props.accessibilityState?.selected === true,
    );

    expect(selectedItem).toBeTruthy();
  });

  it('updates selection on press (uncontrolled)', () => {
    const onValueChange = jest.fn();
    const { getByText } = renderOptionList({
      defaultValue: 'a',
      onValueChange,
    });

    fireEvent.press(getByText('Gamma'));

    expect(onValueChange).toHaveBeenCalledWith('c');
  });

  it('does not fire onValueChange when disabled item is pressed', () => {
    const onValueChange = jest.fn();
    const items: OptionListItemData[] = [
      { value: 'a', label: 'Enabled' },
      { value: 'b', label: 'Disabled', disabled: true },
    ];

    const { getByText } = renderOptionList({ items, onValueChange });

    fireEvent.press(getByText('Disabled'));

    expect(onValueChange).not.toHaveBeenCalled();
  });

  it('renders group labels for grouped items', () => {
    const { getByText } = renderOptionList({ items: GROUPED_ITEMS });

    expect(getByText('Fruits')).toBeTruthy();
    expect(getByText('Vegetables')).toBeTruthy();
    expect(getByText('Apple')).toBeTruthy();
    expect(getByText('Carrot')).toBeTruthy();
  });

  it('passes selected state to renderItem', () => {
    const renderItem = jest.fn(
      (item: OptionListItemData, selected: boolean) => (
        <Text testID={`item-${item.value}`}>
          {item.label} {selected ? 'selected' : ''}
        </Text>
      ),
    );

    render(
      <TestWrapper>
        <OptionList
          items={[
            { value: 'a', label: 'A' },
            { value: 'b', label: 'B', disabled: true },
          ]}
          value='a'
        >
          <OptionListContent renderItem={renderItem} />
        </OptionList>
      </TestWrapper>,
    );

    expect(renderItem).toHaveBeenCalledWith(
      expect.objectContaining({ value: 'a' }),
      true,
    );
    expect(renderItem).toHaveBeenCalledWith(
      expect.objectContaining({ value: 'b' }),
      false,
    );
  });

  it('renders description sub-component', () => {
    const { getByText } = render(
      <TestWrapper>
        <OptionList items={ITEMS} value={null}>
          <OptionListContent
            renderItem={(item) => (
              <OptionListItem value={item.value}>
                <OptionListItemContent>
                  <OptionListItemText>{item.label}</OptionListItemText>
                  <OptionListItemDescription>
                    Description for {item.label}
                  </OptionListItemDescription>
                </OptionListItemContent>
              </OptionListItem>
            )}
          />
        </OptionList>
      </TestWrapper>,
    );

    expect(getByText('Description for Alpha')).toBeTruthy();
  });

  describe('OptionList-level disabled', () => {
    it('prevents all items from being pressed when OptionList is disabled', () => {
      const onValueChange = jest.fn();
      const { getByText } = renderOptionList({
        disabled: true,
        onValueChange,
      });

      fireEvent.press(getByText('Alpha'));
      fireEvent.press(getByText('Beta'));

      expect(onValueChange).not.toHaveBeenCalled();
    });

    it('sets disabled accessibilityState on all items', () => {
      const { getAllByRole } = renderOptionList({ disabled: true });

      const items = getAllByRole('radio');
      for (const item of items) {
        expect(item.props.accessibilityState?.disabled).toBe(true);
      }
    });
  });

  describe('OptionListItemLeading', () => {
    it('renders leading content beside item text', () => {
      const { getByTestId, getByText } = render(
        <TestWrapper>
          <OptionList items={ITEMS} value={null}>
            <OptionListContent
              renderItem={(item) => (
                <OptionListItem value={item.value}>
                  <OptionListItemLeading>
                    <Text testID={`leading-${item.value}`}>icon</Text>
                  </OptionListItemLeading>
                  <OptionListItemContent>
                    <OptionListItemText>{item.label}</OptionListItemText>
                  </OptionListItemContent>
                </OptionListItem>
              )}
            />
          </OptionList>
        </TestWrapper>,
      );

      expect(getByTestId('leading-a')).toBeTruthy();
      expect(getByText('Alpha')).toBeTruthy();
    });
  });

  describe('OptionListItemContentRow', () => {
    it('renders children in a row layout', () => {
      const singleItem: OptionListItemData[] = [{ value: 'a', label: 'Alpha' }];

      const { getByText } = render(
        <TestWrapper>
          <OptionList items={singleItem} value={null}>
            <OptionListContent
              renderItem={(item) => (
                <OptionListItem value={item.value}>
                  <OptionListItemContent>
                    <OptionListItemContentRow>
                      <OptionListItemText>{item.label}</OptionListItemText>
                      <Text>tag</Text>
                    </OptionListItemContentRow>
                  </OptionListItemContent>
                </OptionListItem>
              )}
            />
          </OptionList>
        </TestWrapper>,
      );

      expect(getByText('Alpha')).toBeTruthy();
      expect(getByText('tag')).toBeTruthy();
    });
  });

  describe('OptionListEmptyState', () => {
    it('renders title when item list is empty', () => {
      const { getByText } = render(
        <TestWrapper>
          <OptionList items={[]} value={null}>
            <OptionListContent renderItem={() => null} />
            <OptionListEmptyState title='No results' />
          </OptionList>
        </TestWrapper>,
      );

      expect(getByText('No results')).toBeTruthy();
    });

    it('renders description when provided', () => {
      const { getByText } = render(
        <TestWrapper>
          <OptionList items={[]} value={null}>
            <OptionListContent renderItem={() => null} />
            <OptionListEmptyState
              title='No results'
              description='Try a different search'
            />
          </OptionList>
        </TestWrapper>,
      );

      expect(getByText('No results')).toBeTruthy();
      expect(getByText('Try a different search')).toBeTruthy();
    });

    it('does not render when items are present', () => {
      const { queryByText } = render(
        <TestWrapper>
          <OptionList items={ITEMS} value={null}>
            <OptionListContent
              renderItem={(item) => (
                <OptionListItem value={item.value}>
                  <OptionListItemContent>
                    <OptionListItemText>{item.label}</OptionListItemText>
                  </OptionListItemContent>
                </OptionListItem>
              )}
            />
            <OptionListEmptyState title='No results' />
          </OptionList>
        </TestWrapper>,
      );

      expect(queryByText('No results')).toBeNull();
    });
  });

  describe('OptionListSearch', () => {
    const renderSearchable = ({
      items = ITEMS,
      filter,
      filteredItems,
      searchValue,
      onSearchValueChange,
    }: {
      items?: OptionListItemData[];
      filter?: null | ((item: OptionListItemData, query: string) => boolean);
      filteredItems?: OptionListItemData[];
      searchValue?: string;
      onSearchValueChange?: (v: string) => void;
    } = {}) =>
      render(
        <TestWrapper>
          <OptionList
            items={items}
            filter={filter}
            filteredItems={filteredItems}
            searchValue={searchValue}
            onSearchValueChange={onSearchValueChange}
          >
            <OptionListSearch placeholder='Search' />
            <OptionListContent
              renderItem={(item) => (
                <OptionListItem value={item.value}>
                  <OptionListItemContent>
                    <OptionListItemText>{item.label}</OptionListItemText>
                  </OptionListItemContent>
                </OptionListItem>
              )}
            />
            <OptionListEmptyState title='No results' />
          </OptionList>
        </TestWrapper>,
      );

    it('renders the search input', () => {
      const { getByPlaceholderText } = renderSearchable();

      expect(getByPlaceholderText('Search')).toBeTruthy();
    });

    it('filters items with the default label filter', () => {
      const { getByPlaceholderText, getByText, queryByText } =
        renderSearchable();

      fireEvent.changeText(getByPlaceholderText('Search'), 'alp');

      expect(getByText('Alpha')).toBeTruthy();
      expect(queryByText('Beta')).toBeNull();
      expect(queryByText('Gamma')).toBeNull();
    });

    it('default filter is case-insensitive', () => {
      const { getByPlaceholderText, getByText, queryByText } =
        renderSearchable();

      fireEvent.changeText(getByPlaceholderText('Search'), 'BETA');

      expect(getByText('Beta')).toBeTruthy();
      expect(queryByText('Alpha')).toBeNull();
    });

    it('uses a custom filter when provided', () => {
      const filter = (item: OptionListItemData, query: string): boolean =>
        item.value.startsWith(query);

      const { getByPlaceholderText, getByText, queryByText } = renderSearchable(
        { filter },
      );

      fireEvent.changeText(getByPlaceholderText('Search'), 'b');

      expect(getByText('Beta')).toBeTruthy();
      expect(queryByText('Alpha')).toBeNull();
      expect(queryByText('Gamma')).toBeNull();
    });

    it('disables filtering when filter is null', () => {
      const { getByPlaceholderText, getByText } = renderSearchable({
        filter: null,
      });

      fireEvent.changeText(getByPlaceholderText('Search'), 'alpha');

      expect(getByText('Alpha')).toBeTruthy();
      expect(getByText('Beta')).toBeTruthy();
      expect(getByText('Gamma')).toBeTruthy();
    });

    it('filters within groups and hides empty groups', () => {
      const { getByPlaceholderText, getByText, queryByText } = renderSearchable(
        { items: GROUPED_ITEMS },
      );

      fireEvent.changeText(getByPlaceholderText('Search'), 'apple');

      expect(getByText('Fruits')).toBeTruthy();
      expect(getByText('Apple')).toBeTruthy();
      expect(queryByText('Banana')).toBeNull();
      expect(queryByText('Vegetables')).toBeNull();
      expect(queryByText('Carrot')).toBeNull();
    });

    it('renders empty state when no item matches', () => {
      const { getByPlaceholderText, getByText, queryByText } =
        renderSearchable();

      fireEvent.changeText(getByPlaceholderText('Search'), 'zzz');

      expect(getByText('No results')).toBeTruthy();
      expect(queryByText('Alpha')).toBeNull();
    });

    it('fires onSearchValueChange with the typed query', () => {
      const onSearchValueChange = jest.fn();
      const { getByPlaceholderText } = renderSearchable({
        onSearchValueChange,
      });

      fireEvent.changeText(getByPlaceholderText('Search'), 'be');

      expect(onSearchValueChange).toHaveBeenCalledWith('be');
    });

    it('uses filteredItems instead of the internal filter when provided', () => {
      const { getByPlaceholderText, getByText, queryByText } = renderSearchable(
        {
          filteredItems: [{ value: 'b', label: 'Beta' }],
        },
      );

      fireEvent.changeText(getByPlaceholderText('Search'), 'alpha');

      expect(getByText('Beta')).toBeTruthy();
      expect(queryByText('Alpha')).toBeNull();
      expect(queryByText('Gamma')).toBeNull();
    });
  });

  describe('OptionListTrigger', () => {
    it('calls onPress when pressed', () => {
      const onPress = jest.fn();
      const { getByRole } = render(
        <TestWrapper>
          <OptionList items={ITEMS} value={null}>
            <OptionListTrigger label='Choose' onPress={onPress} />
          </OptionList>
        </TestWrapper>,
      );

      fireEvent.press(getByRole('button'));

      expect(onPress).toHaveBeenCalledTimes(1);
    });

    it('renders the label text', () => {
      const { getByText } = render(
        <TestWrapper>
          <OptionList items={ITEMS} value={null}>
            <OptionListTrigger label='Pick a value' onPress={jest.fn()} />
          </OptionList>
        </TestWrapper>,
      );

      expect(getByText('Pick a value')).toBeTruthy();
    });

    it('renders children as selected value content', () => {
      const { getByText } = render(
        <TestWrapper>
          <OptionList items={ITEMS} value='a'>
            <OptionListTrigger label='Currency' onPress={jest.fn()}>
              <Text>Alpha</Text>
            </OptionListTrigger>
          </OptionList>
        </TestWrapper>,
      );

      expect(getByText('Alpha')).toBeTruthy();
      expect(getByText('Currency')).toBeTruthy();
    });

    it('does not call onPress when disabled', () => {
      const onPress = jest.fn();
      const { getByRole } = render(
        <TestWrapper>
          <OptionList items={ITEMS} value={null}>
            <OptionListTrigger label='Choose' onPress={onPress} disabled />
          </OptionList>
        </TestWrapper>,
      );

      fireEvent.press(getByRole('button'));

      expect(onPress).not.toHaveBeenCalled();
    });

    it('inherits disabled from OptionList', () => {
      const onPress = jest.fn();
      const { getByRole } = render(
        <TestWrapper>
          <OptionList items={ITEMS} value={null} disabled>
            <OptionListTrigger label='Choose' onPress={onPress} />
          </OptionList>
        </TestWrapper>,
      );

      fireEvent.press(getByRole('button'));

      expect(onPress).not.toHaveBeenCalled();
    });

    it('renders without a label', () => {
      const { getByRole, queryByText } = render(
        <TestWrapper>
          <OptionList items={ITEMS} value={null}>
            <OptionListTrigger onPress={jest.fn()}>
              <Text>Selected value</Text>
            </OptionListTrigger>
          </OptionList>
        </TestWrapper>,
      );

      expect(getByRole('button')).toBeTruthy();
      expect(queryByText('Selected value')).toBeTruthy();
    });
  });

  describe('createOptionList', () => {
    it('returns typed components that render and select', () => {
      type Value = 'a' | 'b' | 'c';
      const typedItems: OptionListItemData<Value>[] = [
        { value: 'a', label: 'Alpha' },
        { value: 'b', label: 'Beta' },
        { value: 'c', label: 'Gamma' },
      ];
      const {
        OptionList: TypedList,
        OptionListContent: TypedContent,
        OptionListItem: TypedItem,
        OptionListItemContent: TypedItemContent,
        OptionListItemText: TypedItemText,
      } = createOptionList<Value>();
      const onValueChange = jest.fn();

      const { getByText } = render(
        <TestWrapper>
          <TypedList items={typedItems} onValueChange={onValueChange}>
            <TypedContent
              renderItem={(item) => (
                <TypedItem value={item.value}>
                  <TypedItemContent>
                    <TypedItemText>{item.label}</TypedItemText>
                  </TypedItemContent>
                </TypedItem>
              )}
            />
          </TypedList>
        </TestWrapper>,
      );

      fireEvent.press(getByText('Beta'));

      expect(onValueChange).toHaveBeenCalledWith('b');
    });
  });
});
