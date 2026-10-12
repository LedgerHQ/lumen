export const DEFAULT_GROUP_MAX_VISIBLE = 4;
export const GROUP_MAX_OVERFLOW_DISPLAY = 99;

export type SliceGroupItemsResult<T> = {
  visibleItems: readonly T[];
  overflowCount: number;
};

// The overflow badge takes one of the `maxVisible` slots: 10 items with
// `maxVisible=4` yield 3 visible items and a `+7` badge.
export const sliceGroupItems = <T>(
  items: readonly T[],
  maxVisible: number = DEFAULT_GROUP_MAX_VISIBLE,
): SliceGroupItemsResult<T> => {
  const limit = Math.max(1, Math.floor(maxVisible));

  if (items.length <= limit) {
    return { visibleItems: items, overflowCount: 0 };
  }

  const visibleItems = items.slice(0, limit - 1);

  return {
    visibleItems,
    overflowCount: Math.min(
      items.length - visibleItems.length,
      GROUP_MAX_OVERFLOW_DISPLAY,
    ),
  };
};
