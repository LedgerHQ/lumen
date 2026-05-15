import { useCallback, useMemo, useState } from 'react';
import { useControllableState } from '../../../utils/useControllableState';
import type {
  MetaShape,
  OptionListItemData,
  OptionListItemGroup,
} from '../types';

const groupByField = <TMeta extends MetaShape = MetaShape>(
  items: OptionListItemData<TMeta>[],
): OptionListItemGroup<TMeta>[] => {
  const order: string[] = [];
  const map: Record<string, OptionListItemData<TMeta>[]> = {};
  for (const item of items) {
    const key = item.group ?? '';
    if (!map[key]) {
      order.push(key);
      map[key] = [];
    }
    map[key].push(item);
  }
  return order.map((label) => ({ label, items: map[label] }));
};

const hasGroups = (items: OptionListItemData[]): boolean =>
  items.some((item) => item.group != null);

/**
 * Case-insensitive substring match on `item.label`.
 * Returns `true` for empty/whitespace-only queries so all items are shown.
 */
export const defaultLabelFilter = (
  item: OptionListItemData,
  query: string,
): boolean => {
  const normalizedQuery = query.trim().toLowerCase();
  if (!normalizedQuery) return true;
  return item.label.toLowerCase().includes(normalizedQuery);
};

type UseOptionListItemsParams<TMeta extends MetaShape = MetaShape> = {
  items: OptionListItemData<TMeta>[];
  filter?: null | ((item: OptionListItemData<TMeta>, query: string) => boolean);
  filteredItems?: OptionListItemData<TMeta>[];
  searchValue?: string;
  defaultSearchValue?: string;
  onSearchValueChange?: (value: string) => void;
};

type UseOptionListItemsResult<TMeta extends MetaShape = MetaShape> = {
  isGrouped: boolean;
  groups: OptionListItemGroup<TMeta>[];
  flatItems: OptionListItemData<TMeta>[];
  resolvedSearchValue: string;
  searchMounted: boolean;
  registerSearch: () => () => void;
  handleSearchValueChange: (val: string) => void;
};

/**
 * Manages item grouping, filtering, and search-mount lifecycle for OptionList.
 *
 * - Automatically groups items when any item has a `group` field.
 * - Applies the default case-insensitive label filter when `OptionListSearch`
 *   is mounted and no custom `filter` is provided.
 * - Allows external/async filtering via `filteredItems`, bypassing
 *   the internal filter entirely.
 * - Supports controlled and uncontrolled `searchValue` via `useControllableState`.
 */
export const useOptionListItems = <TMeta extends MetaShape = MetaShape>({
  items,
  filter,
  filteredItems: filteredItemsProp,
  searchValue: searchValueProp,
  defaultSearchValue,
  onSearchValueChange,
}: UseOptionListItemsParams<TMeta>): UseOptionListItemsResult<TMeta> => {
  const [searchMounted, setSearchMounted] = useState(false);
  const [searchValue, setSearchValue] = useControllableState<string>({
    prop: searchValueProp,
    defaultProp: defaultSearchValue ?? '',
    onChange: onSearchValueChange,
  });

  const registerSearch = useCallback((): (() => void) => {
    setSearchMounted(true);
    return () => setSearchMounted(false);
  }, []);

  const handleSearchValueChange = useCallback(
    (val: string) => {
      setSearchValue(val);
    },
    [setSearchValue],
  );

  const filterFn = searchMounted
    ? filter === undefined
      ? defaultLabelFilter
      : filter
    : null;

  const isGrouped = useMemo(() => hasGroups(items), [items]);

  const sourceItems = filteredItemsProp ?? items;

  const filteredFlat = useMemo(() => {
    if (filteredItemsProp) return filteredItemsProp;
    if (!filterFn || !searchValue.trim()) return items;
    return items.filter((item) => filterFn(item, searchValue));
  }, [items, filteredItemsProp, filterFn, searchValue]);

  const groups = useMemo(
    () => (isGrouped ? groupByField(sourceItems) : []),
    [isGrouped, sourceItems],
  );

  const filteredGroups = useMemo(() => {
    if (!isGrouped) return [];
    if (filteredItemsProp) return groupByField(filteredItemsProp);
    if (!filterFn || !searchValue.trim()) return groups;
    return groups
      .map((group) => ({
        ...group,
        items: group.items.filter((item) => filterFn(item, searchValue)),
      }))
      .filter((group) => group.items.length > 0);
  }, [isGrouped, filteredItemsProp, filterFn, searchValue, groups]);

  return {
    isGrouped,
    groups: filteredGroups,
    flatItems: isGrouped ? [] : filteredFlat,
    resolvedSearchValue: searchValue,
    searchMounted,
    registerSearch,
    handleSearchValueChange,
  };
};
