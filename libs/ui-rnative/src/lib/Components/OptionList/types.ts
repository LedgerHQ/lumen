import type { ReactNode } from 'react';
import type {
  StyledPressableProps,
  StyledTextProps,
  StyledViewProps,
} from '../../../styles';
import type { SearchInputProps } from '../SearchInput';

export type MetaShape = Record<string, unknown>;

export type OptionListItemData<TMeta extends MetaShape = MetaShape> = {
  /** Unique string identifier for this item, used for selection tracking. */
  value: string;
  /** Display text. */
  label: string;
  /** Secondary text displayed below the label inside the item. */
  description?: string;
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
   * that your render function needs.
   */
  meta?: TMeta;
};

/** Internal type -- used by sub-components to read shared state from context. */
export type OptionListContextValue = {
  selectedValue: string | null;
  onValueChange: (value: string | null) => void;
  isGrouped: boolean;
  groups: OptionListItemGroup[];
  flatItems: OptionListItemData[];
  resolvedSearchValue: string;
  registerSearch: () => () => void;
  handleSearchValueChange: (value: string) => void;
};

/** Internal type -- consumers never construct this directly. */
export type OptionListItemGroup<TMeta extends MetaShape = MetaShape> = {
  label: string;
  items: OptionListItemData<TMeta>[];
};

export type OptionListProps<TMeta extends MetaShape = MetaShape> = {
  /** Flat array of items. Use the `group` field on each item for automatic grouping. */
  items: OptionListItemData<TMeta>[];
  /** The controlled selected value. */
  value?: string | null;
  /** The default selected value (uncontrolled). */
  defaultValue?: string | null;
  /** Called when the selected value changes. */
  onValueChange?: (value: string | null) => void;
  /** When true, prevents interaction with the entire list. */
  disabled?: boolean;
  /**
   * Filter function used to match items against a search query.
   * When `OptionListSearch` is rendered inside the list, a default case-insensitive
   * label filter is applied automatically. Pass a custom function to override it,
   * or `null` to disable filtering entirely.
   *
   * When items include a `group` field, the filter is applied to individual
   * items within each group. Empty groups are automatically hidden.
   * @default undefined
   */
  filter?: null | ((item: OptionListItemData<TMeta>, query: string) => boolean);
  /**
   * Pre-filtered items to display in the list. When provided, the component uses
   * these items directly instead of filtering `items` internally. Use alongside
   * `onSearchValueChange` for async/remote search where the server handles filtering.
   */
  filteredItems?: OptionListItemData<TMeta>[];
  /**
   * The controlled search input value.
   * Should be used in conjunction with `onSearchValueChange`.
   */
  searchValue?: string;
  /**
   * The search input value when initially rendered (uncontrolled).
   * @default ''
   */
  defaultSearchValue?: string;
  /**
   * Callback fired when the search input value changes.
   * Use to trigger async fetches or track the current query externally.
   */
  onSearchValueChange?: (value: string) => void;
  children: ReactNode;
};

export type OptionListContentProps<TMeta extends MetaShape = MetaShape> = {
  /** Render function called for each item. Receives the item data and selection/disabled state. */
  renderItem: (item: OptionListItemData<TMeta>, selected: boolean) => ReactNode;
} & Omit<StyledViewProps, 'children'>;

export type OptionListItemProps = {
  /** The value associated with this item, used for selection matching. */
  value: string;
  /** Whether the item is disabled. */
  disabled?: boolean;
  children: ReactNode;
} & Omit<StyledPressableProps, 'children' | 'disabled'>;

export type OptionListItemTextProps = {
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

export type OptionListLabelProps = {
  children: ReactNode;
} & Omit<StyledTextProps, 'children'>;

export type OptionListEmptyStateProps = {
  /** Heading displayed when the list is empty. */
  title: string;
  /** Optional secondary text displayed below the title. */
  description?: string;
} & Omit<StyledViewProps, 'children'>;

export type OptionListSearchProps = Omit<
  SearchInputProps,
  'value' | 'onChangeText' | 'defaultValue'
>;

export type OptionListTriggerProps = {
  /** Floating label shown above the selected value. */
  label?: string;
  /** Called when the trigger is pressed. Use to open a BottomSheet or navigate. */
  onPress: () => void;
  /** Content to display as the selected value. */
  children?: ReactNode;
  /** Whether the trigger is disabled. Merges with OptionList disabled context. */
  disabled?: boolean;
} & Omit<StyledPressableProps, 'children' | 'disabled' | 'onPress'>;
