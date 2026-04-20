import type { MetaShape, SelectItemData, SelectItemGroup } from '../types';

/**
 * Groups a flat list of items by their `group` field, preserving
 * the insertion order of the first occurrence of each group key.
 * Items without a `group` value are collected under an empty-string key.
 */
export function groupItemsByKey<TMeta extends MetaShape = MetaShape>(
  items: SelectItemData<TMeta>[],
): SelectItemGroup<TMeta>[] {
  const order: string[] = [];
  const map: Record<string, SelectItemData<TMeta>[]> = {};
  for (const item of items) {
    const key = item.group ?? '';
    if (!map[key]) {
      order.push(key);
      map[key] = [];
    }
    map[key].push(item);
  }
  return order.map((label) => ({ label, items: map[label] }));
}

/**
 * Case-insensitive substring match on `item.label`.
 * Returns `true` for empty/whitespace-only queries so all items are shown.
 */
export const defaultLabelFilter = (
  item: SelectItemData,
  query: string,
): boolean => {
  const normalizedQuery = query.trim().toLowerCase();
  if (!normalizedQuery) return true;
  return item.label.toLowerCase().includes(normalizedQuery);
};
