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
 * Case-insensitive label substring match.
 * Empty query matches everything.
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

/** Grouping, filtering, and search-mount state for OptionList. */
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

  const activeFilter = filter === undefined ? defaultLabelFilter : filter;
  const filterFn = searchMounted ? activeFilter : null;

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
