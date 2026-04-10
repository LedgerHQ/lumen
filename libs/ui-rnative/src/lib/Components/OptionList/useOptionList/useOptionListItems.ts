import { useMemo } from 'react';
import type { OptionListItemData, OptionListItemGroup } from '../types';

const groupByField = (items: OptionListItemData[]): OptionListItemGroup[] => {
  const order: string[] = [];
  const map: Record<string, OptionListItemData[]> = {};
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

const toResult = (items: OptionListItemData[]): UseOptionListItemsResult => {
  const isGrouped = hasGroups(items);
  return isGrouped
    ? { isGrouped: true, groups: groupByField(items), flatItems: [] }
    : { isGrouped: false, groups: [], flatItems: items };
};

type UseOptionListItemsParams = {
  items: OptionListItemData[];
};

type UseOptionListItemsResult = {
  isGrouped: boolean;
  groups: OptionListItemGroup[];
  flatItems: OptionListItemData[];
};

export const useOptionListItems = ({
  items,
}: UseOptionListItemsParams): UseOptionListItemsResult =>
  useMemo(() => toResult(items), [items]);
