import { useMemo } from 'react';
import { useControllableState } from '../../../../utils/useControllableState';
import type {
  MetaShape,
  SelectListItemData,
  SelectListItemGroup,
  SelectListValue,
} from '../types';

const groupByField = <
  T extends SelectListValue = SelectListValue,
  TMeta extends MetaShape = MetaShape,
>(
  items: SelectListItemData<T, TMeta>[],
): SelectListItemGroup<T, TMeta>[] => {
  const order: string[] = [];
  const map: Record<string, SelectListItemData<T, TMeta>[]> = {};
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

const hasGroups = (items: SelectListItemData[]): boolean =>
  items.some((item) => item.group !== undefined);

export const defaultLabelFilter = (
  item: SelectListItemData,
  query: string,
): boolean => item.label.toLowerCase().includes(query.toLowerCase());

type UseSelectListItemsParams<
  T extends SelectListValue = SelectListValue,
  TMeta extends MetaShape = MetaShape,
> = {
  items: SelectListItemData<T, TMeta>[];
  filter?:
    | null
    | ((item: SelectListItemData<T, TMeta>, query: string) => boolean);
  filteredItems?: SelectListItemData<T, TMeta>[];
  searchValue?: string;
  defaultSearchValue?: string;
  onSearchValueChange?: (value: string) => void;
};

type UseSelectListItemsResult<
  T extends SelectListValue = SelectListValue,
  TMeta extends MetaShape = MetaShape,
> = {
  isGrouped: boolean;
  groups: SelectListItemGroup<T, TMeta>[];
  flatItems: SelectListItemData<T, TMeta>[];
  resolvedSearchValue: string;
  handleSearchValueChange: (val: string) => void;
};

export const useSelectListItems = <
  T extends SelectListValue = SelectListValue,
  TMeta extends MetaShape = MetaShape,
>({
  items,
  filter,
  filteredItems,
  searchValue: searchValueProp,
  defaultSearchValue,
  onSearchValueChange,
}: UseSelectListItemsParams<T, TMeta>): UseSelectListItemsResult<T, TMeta> => {
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
