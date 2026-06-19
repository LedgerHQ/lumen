import { useCallback, useMemo, useState } from 'react';
import { useControllableState } from '../../../../utils/useControllableState';
import type {
  MetaShape,
  SelectItemData,
  SelectItemGroup,
  SelectValue,
} from '../types';
import { defaultLabelFilter, groupItemsByKey } from '../utils';

type UseSelectItemsParams<
  T extends SelectValue = SelectValue,
  TMeta extends MetaShape = MetaShape,
> = {
  items: SelectItemData<T, TMeta>[];
  filter?: null | ((item: SelectItemData<T, TMeta>, query: string) => boolean);
  filteredItems?: SelectItemData<T, TMeta>[];
  searchValue?: string;
  defaultSearchValue?: string;
  onSearchValueChange?: (value: string) => void;
};

type UseSelectItemsReturn<
  T extends SelectValue = SelectValue,
  TMeta extends MetaShape = MetaShape,
> = {
  isGrouped: boolean;
  groupedItems: SelectItemGroup<T, TMeta>[] | null;
  filteredItemsForRoot:
    | SelectItemData<T, TMeta>[]
    | SelectItemGroup<T, TMeta>[];
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
export function useSelectItems<
  T extends SelectValue = SelectValue,
  TMeta extends MetaShape = MetaShape,
>({
  items,
  filter,
  filteredItems: filteredItemsProp,
  searchValue: searchValueProp,
  defaultSearchValue,
  onSearchValueChange: onSearchValueChangeProp,
}: UseSelectItemsParams<T, TMeta>): UseSelectItemsReturn<T, TMeta> {
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
    | SelectItemData<T, TMeta>[]
    | SelectItemGroup<T, TMeta>[] => {
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
    | SelectItemData<T, TMeta>[]
    | SelectItemGroup<T, TMeta>[]
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
