import { describe, it, expect, jest } from '@jest/globals';
import { renderHook, act } from '@testing-library/react-native';
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

  describe('filtering', () => {
    it('applies the default case-insensitive label filter', () => {
      const { result } = renderHook(() =>
        useOptionListItems({ items: [btc, eth] }),
      );

      act(() => {
        result.current.handleSearchValueChange('BITCOIN');
      });

      expect(result.current.flatItems).toEqual([btc]);
    });

    it('filters within groups and removes empty groups', () => {
      const { result } = renderHook(() =>
        useOptionListItems({ items: [apple, banana, carrot, spinach] }),
      );

      act(() => {
        result.current.handleSearchValueChange('apple');
      });

      expect(result.current.groups).toEqual([
        { label: 'Fruits', items: [apple] },
      ]);
    });

    it('uses a custom filter when provided', () => {
      const customFilter = (item: OptionListItemData, query: string): boolean =>
        item.value.startsWith(query);

      const { result } = renderHook(() =>
        useOptionListItems({ items: [btc, eth], filter: customFilter }),
      );

      act(() => {
        result.current.handleSearchValueChange('et');
      });

      expect(result.current.flatItems).toEqual([eth]);
    });

    it('disables filtering when filter is null', () => {
      const { result } = renderHook(() =>
        useOptionListItems({ items: [btc, eth], filter: null }),
      );

      act(() => {
        result.current.handleSearchValueChange('bitcoin');
      });

      expect(result.current.flatItems).toEqual([btc, eth]);
    });

    it('returns all items when the query is whitespace-only', () => {
      const { result } = renderHook(() =>
        useOptionListItems({ items: [btc, eth] }),
      );

      act(() => {
        result.current.handleSearchValueChange('   ');
      });

      expect(result.current.flatItems).toEqual([btc, eth]);
    });
  });

  describe('external filteredItems', () => {
    it('uses filteredItems instead of internal filtering', () => {
      const { result } = renderHook(() =>
        useOptionListItems({
          items: [btc, eth],
          filteredItems: [eth],
        }),
      );

      expect(result.current.flatItems).toEqual([eth]);
    });

    it('groups filteredItems when items are grouped', () => {
      const { result } = renderHook(() =>
        useOptionListItems({
          items: [apple, banana, carrot],
          filteredItems: [apple, carrot],
        }),
      );

      expect(result.current.isGrouped).toBe(true);
      expect(result.current.groups).toEqual([
        { label: 'Fruits', items: [apple] },
        { label: 'Vegetables', items: [carrot] },
      ]);
    });
  });

  describe('searchValue', () => {
    it('calls onSearchValueChange with the new value', () => {
      const onSearchValueChange = jest.fn();
      const { result } = renderHook(() =>
        useOptionListItems({ items: [btc, eth], onSearchValueChange }),
      );

      act(() => {
        result.current.handleSearchValueChange('test');
      });

      expect(onSearchValueChange).toHaveBeenCalledWith('test');
      expect(result.current.resolvedSearchValue).toBe('test');
    });

    it('uses defaultSearchValue as the initial uncontrolled value', () => {
      const { result } = renderHook(() =>
        useOptionListItems({
          items: [btc, eth],
          defaultSearchValue: 'default',
        }),
      );

      expect(result.current.resolvedSearchValue).toBe('default');
    });
  });
});
