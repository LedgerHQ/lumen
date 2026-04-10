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
  OptionListItemTitle,
  OptionListItemDescription,
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
                <OptionListItemTitle>{item.label}</OptionListItemTitle>
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

  it('passes selected and disabled state to renderItem', () => {
    const renderItem = jest.fn(
      (
        item: OptionListItemData,
        state: { selected: boolean; disabled: boolean },
      ) => (
        <Text testID={`item-${item.value}`}>
          {item.label} {state.selected ? 'selected' : ''}{' '}
          {state.disabled ? 'disabled' : ''}
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
      { selected: true, disabled: false },
    );
    expect(renderItem).toHaveBeenCalledWith(
      expect.objectContaining({ value: 'b' }),
      { selected: false, disabled: true },
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
                  <OptionListItemTitle>{item.label}</OptionListItemTitle>
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
});
