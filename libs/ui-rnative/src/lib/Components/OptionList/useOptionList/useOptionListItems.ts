import { useMemo } from 'react';
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

export const defaultLabelFilter = (
  item: OptionListItemData,
  query: string,
): boolean => item.label.toLowerCase().includes(query.toLowerCase());

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
  handleSearchValueChange: (val: string) => void;
};

export const useOptionListItems = <TMeta extends MetaShape = MetaShape>({
  items,
  filter,
  filteredItems,
  searchValue: searchValueProp,
  defaultSearchValue,
  onSearchValueChange,
}: UseOptionListItemsParams<TMeta>): UseOptionListItemsResult<TMeta> => {
  const [searchValue, handleSearchValueChange] = useControllableState<string>({
    prop: searchValueProp,
    defaultProp: defaultSearchValue ?? '',
    onChange: onSearchValueChange,
  });

  const isGrouped = useMemo(() => hasGroups(items), [items]);

  const visibleItems = useMemo(() => {
    if (filteredItems) {
      return filteredItems;
    }
    const query = searchValue.trim();
    const activeFilter = filter === undefined ? defaultLabelFilter : filter;
    if (!activeFilter || !query) {
      return items;
    }
    return items.filter((item) => activeFilter(item, query));
  }, [items, filteredItems, filter, searchValue]);

  const groups = useMemo(() => {
    if (!isGrouped) {
      return [];
    }
    return groupByField(visibleItems);
  }, [isGrouped, visibleItems]);

  return {
    isGrouped,
    groups,
    flatItems: isGrouped ? [] : visibleItems,
    resolvedSearchValue: searchValue,
    handleSearchValueChange,
  };
};
