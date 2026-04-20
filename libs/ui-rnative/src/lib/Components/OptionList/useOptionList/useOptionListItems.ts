import { useMemo } from 'react';
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

const toResult = <TMeta extends MetaShape = MetaShape>(
  items: OptionListItemData<TMeta>[],
): UseOptionListItemsResult<TMeta> => {
  const isGrouped = hasGroups(items);
  return isGrouped
    ? { isGrouped: true, groups: groupByField(items), flatItems: [] }
    : { isGrouped: false, groups: [], flatItems: items };
};

type UseOptionListItemsParams<TMeta extends MetaShape = MetaShape> = {
  items: OptionListItemData<TMeta>[];
};

type UseOptionListItemsResult<TMeta extends MetaShape = MetaShape> = {
  isGrouped: boolean;
  groups: OptionListItemGroup<TMeta>[];
  flatItems: OptionListItemData<TMeta>[];
};

export const useOptionListItems = <TMeta extends MetaShape = MetaShape>({
  items,
}: UseOptionListItemsParams<TMeta>): UseOptionListItemsResult<TMeta> =>
  useMemo(() => toResult(items), [items]);
