import { describe, it, expect, jest } from '@jest/globals';
import { ledgerLiveThemes } from '@ledgerhq/lumen-design-core';
import { render, fireEvent } from '@testing-library/react-native';
import { Text } from 'react-native';
import { ThemeProvider } from '../ThemeProvider/ThemeProvider';
import {
  SelectList,
  SelectListContent,
  SelectListItem,
  SelectListItemContent,
  SelectListItemContentRow,
  SelectListItemLeading,
  SelectListItemText,
  SelectListItemDescription,
  SelectListEmptyState,
  SelectListSearch,
  SelectListTrigger,
  createSelectList,
} from './SelectList';
import type { SelectListItemData } from './types';

const TestWrapper = ({ children }: { children: React.ReactNode }) => (
  <ThemeProvider themes={ledgerLiveThemes} colorScheme='dark' locale='en'>
    {children}
  </ThemeProvider>
);

const ITEMS: SelectListItemData[] = [
  { value: 'a', label: 'Alpha' },
  { value: 'b', label: 'Beta' },
  { value: 'c', label: 'Gamma' },
];

const GROUPED_ITEMS: SelectListItemData[] = [
  { value: 'apple', label: 'Apple', group: 'Fruits' },
  { value: 'banana', label: 'Banana', group: 'Fruits' },
  { value: 'carrot', label: 'Carrot', group: 'Vegetables' },
];

const renderSelectList = ({
  items = ITEMS,
  value,
  defaultValue,
  onValueChange,
  disabled,
}: {
  items?: SelectListItemData[];
  value?: string | null;
  defaultValue?: string | null;
  onValueChange?: (v: string | null) => void;
  disabled?: boolean;
} = {}) =>
  render(
    <TestWrapper>
      <SelectList
        items={items}
        value={value}
        defaultValue={defaultValue}
        onValueChange={onValueChange}
        disabled={disabled}
      >
        <SelectListContent
          renderItem={(item) => (
            <SelectListItem value={item.value} disabled={item.disabled}>
              <SelectListItemContent>
                <SelectListItemText>{item.label}</SelectListItemText>
              </SelectListItemContent>
            </SelectListItem>
          )}
        />
      </SelectList>
    </TestWrapper>,
  );

describe('SelectList', () => {
  it('renders all items', () => {
    const { getByText } = renderSelectList();

    expect(getByText('Alpha')).toBeTruthy();
    expect(getByText('Beta')).toBeTruthy();
    expect(getByText('Gamma')).toBeTruthy();
  });

  it('calls onValueChange when an item is pressed', () => {
    const onValueChange = jest.fn();
    const { getByText } = renderSelectList({ onValueChange });

    fireEvent.press(getByText('Beta'));

    expect(onValueChange).toHaveBeenCalledWith('b');
  });

  it('marks the selected item with accessibilityState', () => {
    const { getAllByRole } = renderSelectList({ value: 'a' });

    const items = getAllByRole('radio');
    const selectedItem = items.find(
      (i) => i.props.accessibilityState?.selected === true,
    );

    expect(selectedItem).toBeTruthy();
  });

  it('updates selection on press (uncontrolled)', () => {
    const onValueChange = jest.fn();
    const { getByText } = renderSelectList({
      defaultValue: 'a',
      onValueChange,
    });

    fireEvent.press(getByText('Gamma'));

    expect(onValueChange).toHaveBeenCalledWith('c');
  });

  it('does not fire onValueChange when disabled item is pressed', () => {
    const onValueChange = jest.fn();
    const items: SelectListItemData[] = [
      { value: 'a', label: 'Enabled' },
      { value: 'b', label: 'Disabled', disabled: true },
    ];

    const { getByText } = renderSelectList({ items, onValueChange });

    fireEvent.press(getByText('Disabled'));

    expect(onValueChange).not.toHaveBeenCalled();
  });

  it('renders group labels for grouped items', () => {
    const { getByText } = renderSelectList({ items: GROUPED_ITEMS });

    expect(getByText('Fruits')).toBeTruthy();
    expect(getByText('Vegetables')).toBeTruthy();
    expect(getByText('Apple')).toBeTruthy();
    expect(getByText('Carrot')).toBeTruthy();
  });

  it('passes selected state to renderItem', () => {
    const renderItem = jest.fn(
      (item: SelectListItemData, selected: boolean) => (
        <Text testID={`item-${item.value}`}>
          {item.label} {selected ? 'selected' : ''}
        </Text>
      ),
    );

    render(
      <TestWrapper>
        <SelectList
          items={[
            { value: 'a', label: 'A' },
            { value: 'b', label: 'B', disabled: true },
          ]}
          value='a'
        >
          <SelectListContent renderItem={renderItem} />
        </SelectList>
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
        <SelectList items={ITEMS} value={null}>
          <SelectListContent
            renderItem={(item) => (
              <SelectListItem value={item.value}>
                <SelectListItemContent>
                  <SelectListItemText>{item.label}</SelectListItemText>
                  <SelectListItemDescription>
                    Description for {item.label}
                  </SelectListItemDescription>
                </SelectListItemContent>
              </SelectListItem>
            )}
          />
        </SelectList>
      </TestWrapper>,
    );

    expect(getByText('Description for Alpha')).toBeTruthy();
  });

  describe('SelectList-level disabled', () => {
    it('prevents all items from being pressed when SelectList is disabled', () => {
      const onValueChange = jest.fn();
      const { getByText } = renderSelectList({
        disabled: true,
        onValueChange,
      });

      fireEvent.press(getByText('Alpha'));
      fireEvent.press(getByText('Beta'));

      expect(onValueChange).not.toHaveBeenCalled();
    });

    it('sets disabled accessibilityState on all items', () => {
      const { getAllByRole } = renderSelectList({ disabled: true });

      const items = getAllByRole('radio');
      for (const item of items) {
        expect(item.props.accessibilityState?.disabled).toBe(true);
      }
    });
  });

  describe('SelectListItemLeading', () => {
    it('renders leading content beside item text', () => {
      const { getByTestId, getByText } = render(
        <TestWrapper>
          <SelectList items={ITEMS} value={null}>
            <SelectListContent
              renderItem={(item) => (
                <SelectListItem value={item.value}>
                  <SelectListItemLeading>
                    <Text testID={`leading-${item.value}`}>icon</Text>
                  </SelectListItemLeading>
                  <SelectListItemContent>
                    <SelectListItemText>{item.label}</SelectListItemText>
                  </SelectListItemContent>
                </SelectListItem>
              )}
            />
          </SelectList>
        </TestWrapper>,
      );

      expect(getByTestId('leading-a')).toBeTruthy();
      expect(getByText('Alpha')).toBeTruthy();
    });
  });

  describe('SelectListItemContentRow', () => {
    it('renders children in a row layout', () => {
      const singleItem: SelectListItemData[] = [{ value: 'a', label: 'Alpha' }];

      const { getByText } = render(
        <TestWrapper>
          <SelectList items={singleItem} value={null}>
            <SelectListContent
              renderItem={(item) => (
                <SelectListItem value={item.value}>
                  <SelectListItemContent>
                    <SelectListItemContentRow>
                      <SelectListItemText>{item.label}</SelectListItemText>
                      <Text>tag</Text>
                    </SelectListItemContentRow>
                  </SelectListItemContent>
                </SelectListItem>
              )}
            />
          </SelectList>
        </TestWrapper>,
      );

      expect(getByText('Alpha')).toBeTruthy();
      expect(getByText('tag')).toBeTruthy();
    });
  });

  describe('SelectListEmptyState', () => {
    it('renders title when item list is empty', () => {
      const { getByText } = render(
        <TestWrapper>
          <SelectList items={[]} value={null}>
            <SelectListContent renderItem={() => null} />
            <SelectListEmptyState title='No results' />
          </SelectList>
        </TestWrapper>,
      );

      expect(getByText('No results')).toBeTruthy();
    });

    it('renders description when provided', () => {
      const { getByText } = render(
        <TestWrapper>
          <SelectList items={[]} value={null}>
            <SelectListContent renderItem={() => null} />
            <SelectListEmptyState
              title='No results'
              description='Try a different search'
            />
          </SelectList>
        </TestWrapper>,
      );

      expect(getByText('No results')).toBeTruthy();
      expect(getByText('Try a different search')).toBeTruthy();
    });

    it('does not render when items are present', () => {
      const { queryByText } = render(
        <TestWrapper>
          <SelectList items={ITEMS} value={null}>
            <SelectListContent
              renderItem={(item) => (
                <SelectListItem value={item.value}>
                  <SelectListItemContent>
                    <SelectListItemText>{item.label}</SelectListItemText>
                  </SelectListItemContent>
                </SelectListItem>
              )}
            />
            <SelectListEmptyState title='No results' />
          </SelectList>
        </TestWrapper>,
      );

      expect(queryByText('No results')).toBeNull();
    });
  });

  describe('SelectListSearch', () => {
    const renderSearchable = ({
      items = ITEMS,
      filter,
      filteredItems,
      searchValue,
      onSearchValueChange,
    }: {
      items?: SelectListItemData[];
      filter?: null | ((item: SelectListItemData, query: string) => boolean);
      filteredItems?: SelectListItemData[];
      searchValue?: string;
      onSearchValueChange?: (v: string) => void;
    } = {}) =>
      render(
        <TestWrapper>
          <SelectList
            items={items}
            filter={filter}
            filteredItems={filteredItems}
            searchValue={searchValue}
            onSearchValueChange={onSearchValueChange}
          >
            <SelectListSearch placeholder='Search' />
            <SelectListContent
              renderItem={(item) => (
                <SelectListItem value={item.value}>
                  <SelectListItemContent>
                    <SelectListItemText>{item.label}</SelectListItemText>
                  </SelectListItemContent>
                </SelectListItem>
              )}
            />
            <SelectListEmptyState title='No results' />
          </SelectList>
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
      const filter = (item: SelectListItemData, query: string): boolean =>
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

  describe('SelectListTrigger', () => {
    it('calls onPress when pressed', () => {
      const onPress = jest.fn();
      const { getByRole } = render(
        <TestWrapper>
          <SelectList items={ITEMS} value={null}>
            <SelectListTrigger label='Choose' onPress={onPress} />
          </SelectList>
        </TestWrapper>,
      );

      fireEvent.press(getByRole('button'));

      expect(onPress).toHaveBeenCalledTimes(1);
    });

    it('renders the label text', () => {
      const { getByText } = render(
        <TestWrapper>
          <SelectList items={ITEMS} value={null}>
            <SelectListTrigger label='Pick a value' onPress={jest.fn()} />
          </SelectList>
        </TestWrapper>,
      );

      expect(getByText('Pick a value')).toBeTruthy();
    });

    it('renders children as selected value content', () => {
      const { getByText } = render(
        <TestWrapper>
          <SelectList items={ITEMS} value='a'>
            <SelectListTrigger label='Currency' onPress={jest.fn()}>
              <Text>Alpha</Text>
            </SelectListTrigger>
          </SelectList>
        </TestWrapper>,
      );

      expect(getByText('Alpha')).toBeTruthy();
      expect(getByText('Currency')).toBeTruthy();
    });

    it('does not call onPress when disabled', () => {
      const onPress = jest.fn();
      const { getByRole } = render(
        <TestWrapper>
          <SelectList items={ITEMS} value={null}>
            <SelectListTrigger label='Choose' onPress={onPress} disabled />
          </SelectList>
        </TestWrapper>,
      );

      fireEvent.press(getByRole('button'));

      expect(onPress).not.toHaveBeenCalled();
    });

    it('inherits disabled from SelectList', () => {
      const onPress = jest.fn();
      const { getByRole } = render(
        <TestWrapper>
          <SelectList items={ITEMS} value={null} disabled>
            <SelectListTrigger label='Choose' onPress={onPress} />
          </SelectList>
        </TestWrapper>,
      );

      fireEvent.press(getByRole('button'));

      expect(onPress).not.toHaveBeenCalled();
    });

    it('renders without a label', () => {
      const { getByRole, queryByText } = render(
        <TestWrapper>
          <SelectList items={ITEMS} value={null}>
            <SelectListTrigger onPress={jest.fn()}>
              <Text>Selected value</Text>
            </SelectListTrigger>
          </SelectList>
        </TestWrapper>,
      );

      expect(getByRole('button')).toBeTruthy();
      expect(queryByText('Selected value')).toBeTruthy();
    });
  });

  describe('createSelectList', () => {
    it('returns typed components that render and select', () => {
      type Value = 'a' | 'b' | 'c';
      const typedItems: SelectListItemData<Value>[] = [
        { value: 'a', label: 'Alpha' },
        { value: 'b', label: 'Beta' },
        { value: 'c', label: 'Gamma' },
      ];
      const {
        SelectList: TypedList,
        SelectListContent: TypedContent,
        SelectListItem: TypedItem,
        SelectListItemContent: TypedItemContent,
        SelectListItemText: TypedItemText,
      } = createSelectList<Value>();
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
