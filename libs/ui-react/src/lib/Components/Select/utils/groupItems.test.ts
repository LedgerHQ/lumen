import { describe, it, expect } from 'vitest';
import type { SelectItemData } from '../types';
import { defaultLabelFilter, groupItemsByKey } from './groupItems';

describe('groupItemsByKey', () => {
  it('groups items by their group field', () => {
    const items: SelectItemData[] = [
      { value: 'a', label: 'Apple', group: 'Fruits' },
      { value: 'b', label: 'Banana', group: 'Fruits' },
      { value: 'c', label: 'Carrot', group: 'Vegetables' },
    ];

    expect(groupItemsByKey(items)).toEqual([
      { value: 'Fruits', items: [items[0], items[1]] },
      { value: 'Vegetables', items: [items[2]] },
    ]);
  });

  it('preserves insertion order of groups', () => {
    const items: SelectItemData[] = [
      { value: 'c', label: 'Carrot', group: 'Vegetables' },
      { value: 'a', label: 'Apple', group: 'Fruits' },
      { value: 'b', label: 'Broccoli', group: 'Vegetables' },
    ];

    const groups = groupItemsByKey(items);

    expect(groups[0].value).toBe('Vegetables');
    expect(groups[1].value).toBe('Fruits');
  });

  it('collects items without a group under an empty-string key', () => {
    const items: SelectItemData[] = [
      { value: 'a', label: 'Apple' },
      { value: 'b', label: 'Banana' },
    ];

    expect(groupItemsByKey(items)).toEqual([
      { value: '', items: [items[0], items[1]] },
    ]);
  });

  it('handles a mix of grouped and ungrouped items', () => {
    const items: SelectItemData[] = [
      { value: 'a', label: 'Apple', group: 'Fruits' },
      { value: 'x', label: 'Mystery' },
      { value: 'c', label: 'Carrot', group: 'Vegetables' },
    ];

    const groups = groupItemsByKey(items);

    expect(groups).toHaveLength(3);
    expect(groups[0].value).toBe('Fruits');
    expect(groups[1].value).toBe('');
    expect(groups[2].value).toBe('Vegetables');
  });

  it('returns an empty array for an empty input', () => {
    expect(groupItemsByKey([])).toEqual([]);
  });
});

describe('defaultLabelFilter', () => {
  const item: SelectItemData = { value: 'opt1', label: 'Hello World' };

  it('matches when label contains the query (case-insensitive)', () => {
    expect(defaultLabelFilter(item, 'hello')).toBe(true);
    expect(defaultLabelFilter(item, 'WORLD')).toBe(true);
    expect(defaultLabelFilter(item, 'lo Wo')).toBe(true);
  });

  it('returns false when label does not contain the query', () => {
    expect(defaultLabelFilter(item, 'goodbye')).toBe(false);
  });

  it('returns true for an empty query', () => {
    expect(defaultLabelFilter(item, '')).toBe(true);
  });

  it('returns true for a whitespace-only query', () => {
    expect(defaultLabelFilter(item, '   ')).toBe(true);
  });

  it('trims the query before matching', () => {
    expect(defaultLabelFilter(item, '  hello  ')).toBe(true);
  });
});
