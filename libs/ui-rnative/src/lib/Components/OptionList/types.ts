import { ReactNode } from 'react';
import {
  StyledPressableProps,
  StyledTextProps,
  StyledViewProps,
} from '../../../styles';

export type OptionListItemData = {
  /** Unique string identifier for this item, used for selection tracking. */
  value: string;
  /** Display text. Also the field matched against by the default search filter. */
  label: string;
  /** When true, the item cannot be selected or focused. */
  disabled?: boolean;
  /**
   * Optional group name. Items sharing the same `group` value are grouped together
   * with automatic headers and separators.
   * Groups are ordered by first occurrence in the `items` array.
   */
  group?: string;
  /**
   * Arbitrary data attached to this item.
   * Use it to carry extra fields (icons, tickers, IDs, etc.)
   * that your render function or custom filter needs.
   */
  meta?: Record<string, unknown>;
};

/** Internal type -- used by sub-components to read shared state from context. */
export type OptionListContextValue = {
  selectedValue: string | null;
  onValueChange: (value: string | null) => void;
  isGrouped: boolean;
  groups: OptionListItemGroup[];
  flatItems: OptionListItemData[];
};

/** Internal type -- consumers never construct this directly. */
export type OptionListItemGroup = {
  label: string;
  items: OptionListItemData[];
};

export type OptionListProps = {
  /** Flat array of items. Use the `group` field on each item for automatic grouping. */
  items: OptionListItemData[];
  /** The controlled selected value. */
  value?: string | null;
  /** The default selected value (uncontrolled). */
  defaultValue?: string | null;
  /** Called when the selected value changes. */
  onValueChange?: (value: string | null) => void;
  /** When true, prevents interaction with the entire list. */
  disabled?: boolean;
  /**
   * Custom filter function applied to each item.
   * Prepared for future search integration.
   */
  filter?: (item: OptionListItemData, inputValue: string) => boolean;
  /**
   * Pre-filtered items that override the default filtering.
   * Prepared for future search integration.
   */
  filteredItems?: OptionListItemData[];
  children: ReactNode;
};

export type OptionListContentProps = {
  /** Render function called for each item. Receives the item data and selection/disabled state. */
  renderItem: (
    item: OptionListItemData,
    state: { selected: boolean; disabled: boolean },
  ) => ReactNode;
} & StyledViewProps;

export type OptionListItemProps = {
  /** The value associated with this item, used for selection matching. */
  value: string;
  /** Whether the item is disabled. */
  disabled?: boolean;
  children: ReactNode;
} & Omit<StyledPressableProps, 'children' | 'disabled'>;

export type OptionListItemTitleProps = {
  children: ReactNode;
} & Omit<StyledTextProps, 'children'>;

export type OptionListItemDescriptionProps = {
  children: ReactNode;
} & Omit<StyledTextProps, 'children'>;

export type OptionListItemContentRowProps = {
  children: ReactNode;
} & Omit<StyledViewProps, 'children'>;

export type OptionListItemContentProps = {
  children: ReactNode;
} & Omit<StyledViewProps, 'children'>;

export type OptionListItemLeadingProps = {
  children: ReactNode;
} & Omit<StyledViewProps, 'children'>;
