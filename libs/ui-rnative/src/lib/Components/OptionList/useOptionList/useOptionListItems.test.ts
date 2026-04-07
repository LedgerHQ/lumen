import { describe, it, expect } from '@jest/globals';
import { renderHook } from '@testing-library/react-native';
import type { OptionListItemData } from '../types';
import { useOptionListItems } from './useOptionListItems';

const apple: OptionListItemData = {
  value: 'apple',
  label: 'Apple',
  group: 'Fruits',
};
const banana: OptionListItemData = {
  value: 'banana',
  label: 'Banana',
  group: 'Fruits',
};
const carrot: OptionListItemData = {
  value: 'carrot',
  label: 'Carrot',
  group: 'Vegetables',
};
const spinach: OptionListItemData = {
  value: 'spinach',
  label: 'Spinach',
  group: 'Vegetables',
};

const btc: OptionListItemData = { value: 'btc', label: 'Bitcoin' };
const eth: OptionListItemData = { value: 'eth', label: 'Ethereum' };

describe('useOptionListItems', () => {
  describe('flat items (no group field)', () => {
    it('returns isGrouped false and flatItems as-is', () => {
      const { result } = renderHook(() =>
        useOptionListItems({ items: [btc, eth] }),
      );

      expect(result.current.isGrouped).toBe(false);
      expect(result.current.flatItems).toEqual([btc, eth]);
      expect(result.current.groups).toEqual([]);
    });

    it('returns empty flatItems for empty array', () => {
      const { result } = renderHook(() => useOptionListItems({ items: [] }));

      expect(result.current.isGrouped).toBe(false);
      expect(result.current.flatItems).toEqual([]);
    });
  });

  describe('grouped items (group field present)', () => {
    it('detects groups and builds OptionListItemGroup[]', () => {
      const { result } = renderHook(() =>
        useOptionListItems({ items: [apple, banana, carrot, spinach] }),
      );

      expect(result.current.isGrouped).toBe(true);
      expect(result.current.flatItems).toEqual([]);
      expect(result.current.groups).toEqual([
        { label: 'Fruits', items: [apple, banana] },
        { label: 'Vegetables', items: [carrot, spinach] },
      ]);
    });

    it('preserves group order by first occurrence', () => {
      const { result } = renderHook(() =>
        useOptionListItems({ items: [carrot, apple, spinach, banana] }),
      );

      expect(result.current.groups[0].label).toBe('Vegetables');
      expect(result.current.groups[1].label).toBe('Fruits');
    });
  });

  describe('filter', () => {
    it('applies filter to flat items', () => {
      const filter = (item: OptionListItemData) => item.label.startsWith('B');

      const { result } = renderHook(() =>
        useOptionListItems({ items: [btc, eth], filter }),
      );

      expect(result.current.isGrouped).toBe(false);
      expect(result.current.flatItems).toEqual([btc]);
    });

    it('applies filter to grouped items and drops empty groups', () => {
      const filter = (item: OptionListItemData) => item.value === 'apple';

      const { result } = renderHook(() =>
        useOptionListItems({ items: [apple, banana, carrot], filter }),
      );

      expect(result.current.isGrouped).toBe(true);
      expect(result.current.groups).toEqual([
        { label: 'Fruits', items: [apple] },
      ]);
    });
  });

  describe('filteredItems', () => {
    it('uses filteredItems over original items', () => {
      const { result } = renderHook(() =>
        useOptionListItems({ items: [btc, eth], filteredItems: [eth] }),
      );

      expect(result.current.flatItems).toEqual([eth]);
    });

    it('takes precedence over filter', () => {
      const filter = () => false;

      const { result } = renderHook(() =>
        useOptionListItems({
          items: [btc, eth],
          filter,
          filteredItems: [btc],
        }),
      );

      expect(result.current.flatItems).toEqual([btc]);
    });
  });
});
