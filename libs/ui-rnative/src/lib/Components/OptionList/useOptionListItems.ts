import { useMemo } from 'react';
import type { OptionListItemData, OptionListItemGroup } from './types';

const groupByField = (items: OptionListItemData[]): OptionListItemGroup[] =>
  Array.from(
    items.reduce<Map<string, OptionListItemData[]>>((acc, item) => {
      const key = item.group ?? '';
      return acc.set(key, [...(acc.get(key) ?? []), item]);
    }, new Map()),
    ([label, items]) => ({ label, items }),
  );

const hasGroups = (items: OptionListItemData[]): boolean =>
  items.some((item) => item.group != null);

const resolveItems = (
  items: OptionListItemData[],
  filter?: (item: OptionListItemData, inputValue: string) => boolean,
  filteredItems?: OptionListItemData[],
): OptionListItemData[] =>
  filteredItems ?? (filter ? items.filter((item) => filter(item, '')) : items);

const toResult = (items: OptionListItemData[]): UseOptionListItemsResult => {
  const isGrouped = hasGroups(items);
  return isGrouped
    ? { isGrouped: true, groups: groupByField(items), flatItems: [] }
    : { isGrouped: false, groups: [], flatItems: items };
};

type UseOptionListItemsParams = {
  items: OptionListItemData[];
  filter?: (item: OptionListItemData, inputValue: string) => boolean;
  filteredItems?: OptionListItemData[];
};

type UseOptionListItemsResult = {
  isGrouped: boolean;
  groups: OptionListItemGroup[];
  flatItems: OptionListItemData[];
};

export const useOptionListItems = ({
  items,
  filter,
  filteredItems,
}: UseOptionListItemsParams): UseOptionListItemsResult =>
  useMemo(
    () => toResult(resolveItems(items, filter, filteredItems)),
    [items, filter, filteredItems],
  );
