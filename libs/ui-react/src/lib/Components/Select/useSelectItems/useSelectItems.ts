import { useCallback, useMemo, useState } from 'react';
import { useControllableState } from '../../../../utils/useControllableState';
import type { SelectItemData, SelectItemGroup } from '../types';
import { defaultLabelFilter, groupItemsByKey } from '../utils';

type UseSelectItemsParams = {
  items: SelectItemData[];
  filter?: null | ((item: SelectItemData, query: string) => boolean);
  filteredItems?: SelectItemData[];
  inputValue?: string;
  defaultInputValue?: string;
  onInputValueChange?: (value: string) => void;
};

type UseSelectItemsReturn = {
  isGrouped: boolean;
  groupedItems: SelectItemGroup[] | null;
  filteredItemsForRoot: SelectItemData[] | SelectItemGroup[];
  resolvedInputValue: string;
  registerSearch: () => () => void;
  handleInputValueChange: (val: string) => void;
};

/**
 * Manages item grouping, filtering, and search-mount lifecycle for the Select.
 *
 * - Automatically groups items when any item has a `group` field.
 * - Applies the default case-insensitive label filter when `SelectSearch`
 *   is mounted and no custom `filter` is provided.
 * - Allows external/async filtering via `filteredItems`, bypassing
 *   the internal filter entirely.
 * - Supports controlled and uncontrolled `inputValue` via `useControllableState`.
 */
export function useSelectItems({
  items,
  filter,
  filteredItems: filteredItemsProp,
  inputValue: inputValueProp,
  defaultInputValue,
  onInputValueChange: onInputValueChangeProp,
}: UseSelectItemsParams): UseSelectItemsReturn {
  const [searchMounted, setSearchMounted] = useState(false);
  const [inputValue, setInputValue] = useControllableState<string>({
    prop: inputValueProp,
    defaultProp: defaultInputValue ?? '',
    onChange: onInputValueChangeProp,
  });

  const registerSearch = useCallback((): (() => void) => {
    setSearchMounted(true);
    return () => setSearchMounted(false);
  }, []);

  const handleInputValueChange = useCallback(
    (val: string) => {
      setInputValue(val);
    },
    [setInputValue],
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
    | SelectItemData[]
    | SelectItemGroup[] => {
    if (!filterFn || !inputValue.trim()) return groupedItems ?? items;

    if (groupedItems) {
      return groupedItems
        .map((group) => ({
          ...group,
          items: group.items.filter((item) => filterFn(item, inputValue)),
        }))
        .filter((group) => group.items.length > 0);
    }

    return items.filter((item) => filterFn(item, inputValue));
  }, [groupedItems, items, inputValue, filterFn]);

  const externalGroupedItems = useMemo(():
    | SelectItemData[]
    | SelectItemGroup[]
    | null => {
    if (!filteredItemsProp) return null;
    return isGrouped ? groupItemsByKey(filteredItemsProp) : filteredItemsProp;
  }, [filteredItemsProp, isGrouped]);

  const filteredItemsForRoot = externalGroupedItems ?? internalFilteredItems;

  return {
    isGrouped,
    groupedItems,
    filteredItemsForRoot,
    resolvedInputValue: inputValue,
    registerSearch,
    handleInputValueChange,
  };
}
