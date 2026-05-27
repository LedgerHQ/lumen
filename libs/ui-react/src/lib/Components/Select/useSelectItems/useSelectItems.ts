import { useCallback, useMemo, useState } from 'react';
import { useControllableState } from '../../../../utils/useControllableState';
import type { MetaShape, SelectItemData, SelectItemGroup } from '../types';
import { defaultLabelFilter, groupItemsByKey } from '../utils';

type UseSelectItemsParams<TMeta extends MetaShape = MetaShape> = {
  items: SelectItemData<TMeta>[];
  filter?: null | ((item: SelectItemData<TMeta>, query: string) => boolean);
  filteredItems?: SelectItemData<TMeta>[];
  searchValue?: string;
  defaultSearchValue?: string;
  onSearchValueChange?: (value: string) => void;
};

type UseSelectItemsReturn<TMeta extends MetaShape = MetaShape> = {
  isGrouped: boolean;
  groupedItems: SelectItemGroup<TMeta>[] | null;
  filteredItemsForRoot: SelectItemData<TMeta>[] | SelectItemGroup<TMeta>[];
  resolvedSearchValue: string;
  searchMounted: boolean;
  registerSearch: () => () => void;
  handleSearchValueChange: (val: string) => void;
};

/**
 * Manages item grouping, filtering, and search-mount lifecycle for the Select.
 *
 * - Automatically groups items when any item has a `group` field.
 * - Applies the default case-insensitive label filter when `SelectSearch`
 *   is mounted and no custom `filter` is provided.
 * - Allows external/async filtering via `filteredItems`, bypassing
 *   the internal filter entirely.
 * - Supports controlled and uncontrolled `searchValue` via `useControllableState`.
 */
export function useSelectItems<TMeta extends MetaShape = MetaShape>({
  items,
  filter,
  filteredItems: filteredItemsProp,
  searchValue: searchValueProp,
  defaultSearchValue,
  onSearchValueChange: onSearchValueChangeProp,
}: UseSelectItemsParams<TMeta>): UseSelectItemsReturn<TMeta> {
  const [searchMounted, setSearchMounted] = useState(false);
  const [searchValue, setSearchValue] = useControllableState<string>({
    prop: searchValueProp,
    defaultProp: defaultSearchValue ?? '',
    onChange: onSearchValueChangeProp,
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

  const isGrouped = useMemo(
    () => items.some((item) => item.group != null),
    [items],
  );

  const groupedItems = useMemo(
    () => (isGrouped ? groupItemsByKey(items) : null),
    [items, isGrouped],
  );

  const internalFilteredItems = useMemo(():
    | SelectItemData<TMeta>[]
    | SelectItemGroup<TMeta>[] => {
    if (!filterFn || !searchValue.trim()) return groupedItems ?? items;

    if (groupedItems) {
      return groupedItems
        .map((group) => ({
          ...group,
          items: group.items.filter((item) => filterFn(item, searchValue)),
        }))
        .filter((group) => group.items.length > 0);
    }

    return items.filter((item) => filterFn(item, searchValue));
  }, [groupedItems, items, searchValue, filterFn]);

  const externalGroupedItems = useMemo(():
    | SelectItemData<TMeta>[]
    | SelectItemGroup<TMeta>[]
    | null => {
    if (!filteredItemsProp) return null;
    return isGrouped ? groupItemsByKey(filteredItemsProp) : filteredItemsProp;
  }, [filteredItemsProp, isGrouped]);

  const filteredItemsForRoot = externalGroupedItems ?? internalFilteredItems;

  return {
    isGrouped,
    groupedItems,
    filteredItemsForRoot,
    resolvedSearchValue: searchValue,
    searchMounted,
    registerSearch,
    handleSearchValueChange,
  };
}
