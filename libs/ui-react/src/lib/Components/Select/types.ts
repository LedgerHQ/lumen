import type {
  ComponentPropsWithRef,
  ReactElement,
  ReactNode,
  RefObject,
} from 'react';
import type { SearchInputProps } from '../SearchInput/types';

export type MetaShape = Record<string, unknown>;

export type SelectItemData<TMeta extends MetaShape = MetaShape> = {
  /** Unique string identifier for this item, used for selection tracking. */
  value: string;
  /** Display text used in the trigger. Also the field matched against by the default search filter. */
  label: string;
  /** When true, the item cannot be selected or focused. */
  disabled?: boolean;
  /** Secondary text displayed below the label inside the item. */
  description?: string;
  /**
   * Optional group name. Items with the same `group` are grouped together
   * with automatic headers, separators, and per-group filtering.
   * The group name is used as the displayed group label.
   *
   * Groups are ordered by first occurrence in the `items` array.
   * Ungrouped items are collected together at the position of the first ungrouped item.
   */
  group?: string;
  /**
   * Optional bag of arbitrary data attached to this item.
   * Use it to carry extra fields (icons, tickers, IDs, etc.)
   * that your render function or custom filter needs.
   */
  meta?: TMeta;
};

/** @internal A named group of select items, used to represent a resolved group with its header label and child items. */
export type SelectItemGroup<TMeta extends MetaShape = MetaShape> = {
  /** The displayed group name, matching the `group` field on each child item. */
  label: string;
  /** The items belonging to this group. */
  items: SelectItemData<TMeta>[];
};

export type SelectTriggerRenderProps = {
  /**
   * The currently selected value, or null if nothing is selected.
   */
  selectedValue: string | null;
  /**
   * A ReactNode that renders the selected item's content via `Combobox.Value`.
   */
  selectedContent: ReactNode;
};

export type SelectProps<TMeta extends MetaShape = MetaShape> = {
  /**
   * The children of the select.
   */
  children: ReactNode;
  /**
   * The items displayed in the dropdown list.
   * Each item must have a `value` (unique string identifier) and a `label`
   * (display text for search and trigger). Use the optional `meta` field to
   * attach arbitrary data (icons, tickers, IDs, etc.) accessible in the
   * render function and custom filters.
   *
   * When items include a `group` field, the component automatically groups
   * them by that value, rendering group headers, separators, and per-group
   * collection iteration internally.
   */
  items: SelectItemData<TMeta>[];
  /**
   * Filter function used to match items against a search query.
   * When `SelectSearch` is rendered inside the content, a default case-insensitive
   * label filter is applied automatically. Pass a custom function to override it,
   * or `null` to disable filtering entirely.
   *
   * When items include a `group` field, the filter is applied to individual
   * items within each group. Empty groups are automatically hidden.
   * @default undefined
   */
  filter?: null | ((item: SelectItemData<TMeta>, query: string) => boolean);
  /**
   * Pre-filtered items to display in the list. When provided, the component uses
   * these items directly instead of filtering `items` internally. Use alongside
   * `onSearchValueChange` for async/remote search where the server handles filtering.
   */
  filteredItems?: SelectItemData<TMeta>[];
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
  /**
   * Whether the popup is open. Use for controlled open state.
   * Must be used in conjunction with `onOpenChange`.
   */
  open?: boolean;
  /**
   * The open state of the popup when initially rendered.
   * Use when you do not need to control its open state.
   * @default false
   */
  defaultOpen?: boolean;
  /**
   * The value of the select when initially rendered (uncontrolled).
   */
  defaultValue?: string;
  /**
   * Event handler called when the open state of the popup changes.
   */
  onOpenChange?: (open: boolean) => void;
  /**
   * The controlled value of the select.
   * Should be used in conjunction with `onValueChange`.
   */
  value?: string | null;
  /**
   * Event handler called when the selected value changes.
   * Receives `null` when the selection is cleared (e.g. combobox clear behavior).
   */
  onValueChange?: (value: string | null) => void;
  /**
   * The name of the select for form submission.
   */
  name?: string;
  /**
   * When true, prevents the user from interacting with the select.
   */
  disabled?: boolean;
  /**
   * Whether the select is required for form validation.
   * @default false
   */
  required?: boolean;
};

export type SelectTriggerProps = {
  /**
   * Render function that replaces the default input-style trigger.
   * When provided, the trigger delegates rendering to this function.
   * Use any component (e.g. `MediaButton`) or a custom render function.
   *
   * @example render={({ selectedValue, selectedContent }) => <MediaButton>{selectedValue ? selectedContent : 'Label'}</MediaButton>}
   * @example render={({ selectedValue, selectedContent }) => <MyTrigger />}
   */
  render?: (props: SelectTriggerRenderProps) => ReactElement;
  /**
   * Extra class names to apply to the trigger element.
   */
  className?: string;
  /**
   * The label text that floats above the input when focused or filled.
   */
  label?: string;
  /**
   * Additional class names to apply to the label element.
   */
  labelClassName?: string;
} & ComponentPropsWithRef<'button'>;

export type SelectContentProps = {
  /**
   * The children of the select content.
   */
  children: ReactNode;
  /**
   * The preferred side of the anchor to render against when open.
   * @default "bottom"
   */
  side?: 'top' | 'right' | 'bottom' | 'left';
  /**
   * The distance in pixels from the trigger.
   * @default 8
   */
  sideOffset?: number;
  /**
   * The preferred alignment against the trigger.
   * @default "start"
   */
  align?: 'start' | 'center' | 'end';
  /**
   * Extra class names to apply to the content element.
   */
  className?: string;
  /**
   * Determines the element to focus when the popover is opened.
   *
   * - `false`: Do not move focus.
   * - `true`: Move focus based on the default behavior (first tabbable element of the select content).
   * - `RefObject`: Move focus to the ref element.
   *
   * @default true
   */
  initialFocus?: boolean | RefObject<HTMLElement | null>;
} & ComponentPropsWithRef<'div'>;

export type SelectListProps<TMeta extends MetaShape = MetaShape> = {
  /**
   * A render function that receives each item and its index, returning a ReactNode.
   *
   * When items are grouped, this render function is used for individual items
   * within each group — the group scaffolding (headers, separators, collection)
   * is handled automatically by `SelectList`.
   * @example renderItem={(item) => <SelectItem value={item.value}>{item.label}</SelectItem>}
   */
  renderItem: (item: SelectItemData<TMeta>, index: number) => ReactNode;
  /**
   * Extra class names to apply to the list element.
   */
  className?: string;
} & ComponentPropsWithRef<'div'>;

export type SelectLabelProps = {
  /**
   * The children of the select label.
   */
  children: ReactNode;
  /**
   * Extra class names to apply to the label element.
   */
  className?: string;
} & ComponentPropsWithRef<'div'>;

export type SelectItemTextProps = {
  /**
   * The text content of the item.
   */
  children: ReactNode;
  /**
   * Extra class names to apply to the item text element.
   */
  className?: string;
} & ComponentPropsWithRef<'span'>;

export type SelectItemProps = {
  /**
   * The unique string value associated with this item.
   */
  value: string;
  /**
   * The children of the select item. Supports custom content
   * (icons, tags, descriptions, etc.) alongside `SelectItemText`.
   */
  children: ReactNode;
  /**
   * Whether the item is disabled.
   * @default false
   */
  disabled?: boolean;
  /**
   * Extra class names to apply to the item element.
   */
  className?: string;
} & ComponentPropsWithRef<'div'>;

export type SelectSeparatorProps = {
  /**
   * Extra class names to apply to the separator element.
   */
  className?: string;
} & ComponentPropsWithRef<'div'>;

export type SelectSearchProps = Pick<
  SearchInputProps,
  | 'placeholder'
  | 'className'
  | 'helperText'
  | 'status'
  | 'aria-invalid'
  | 'suffix'
  | 'onClear'
  | 'hideClearButton'
>;

export type SelectEmptyStateProps = {
  /**
   * The primary heading displayed in the empty state (e.g. "No results found").
   */
  title?: ReactNode;
  /**
   * Secondary text displayed below the title (e.g. a hint or explanation).
   */
  description?: ReactNode;
  /**
   * Extra class names to apply to the empty state element.
   */
  className?: string;
} & ComponentPropsWithRef<'div'>;

export type SelectItemContentProps = {
  /**
   * The content of the item, typically `SelectItemText` and optionally
   * `SelectItemDescription` stacked vertically.
   */
  children: ReactNode;
  /**
   * Extra class names to apply to the content wrapper.
   */
  className?: string;
} & ComponentPropsWithRef<'div'>;

export type SelectItemDescriptionProps = {
  /**
   * Secondary text displayed below the item label.
   */
  children: ReactNode;
  /**
   * Extra class names to apply to the description element.
   */
  className?: string;
} & ComponentPropsWithRef<'div'>;
