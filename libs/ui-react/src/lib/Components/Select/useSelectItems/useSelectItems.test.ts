import { renderHook, act } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import type { SelectItemData } from '../types';
import { useSelectItems } from './useSelectItems';

const flat: SelectItemData[] = [
  { value: 'opt1', label: 'Option 1' },
  { value: 'opt2', label: 'Option 2' },
  { value: 'opt3', label: 'Option 3' },
];

const grouped: SelectItemData[] = [
  { value: 'apple', label: 'Apple', group: 'Fruits' },
  { value: 'banana', label: 'Banana', group: 'Fruits' },
  { value: 'carrot', label: 'Carrot', group: 'Vegetables' },
];

describe('useSelectItems', () => {
  describe('grouping', () => {
    it('sets isGrouped to false for flat items', () => {
      const { result } = renderHook(() => useSelectItems({ items: flat }));

      expect(result.current.isGrouped).toBe(false);
      expect(result.current.groupedItems).toBeNull();
    });

    it('sets isGrouped to true and builds groupedItems when items have a group field', () => {
      const { result } = renderHook(() => useSelectItems({ items: grouped }));

      expect(result.current.isGrouped).toBe(true);
      expect(result.current.groupedItems).toHaveLength(2);
      expect(result.current.groupedItems![0].value).toBe('Fruits');
      expect(result.current.groupedItems![1].value).toBe('Vegetables');
    });
  });

  describe('filtering (search not mounted)', () => {
    it('returns all items when search is not mounted', () => {
      const { result } = renderHook(() => useSelectItems({ items: flat }));

      expect(result.current.filteredItemsForRoot).toEqual(flat);
    });

    it('returns grouped items when search is not mounted and items are grouped', () => {
      const { result } = renderHook(() => useSelectItems({ items: grouped }));

      expect(result.current.filteredItemsForRoot).toEqual(
        result.current.groupedItems,
      );
    });
  });

  describe('filtering (search mounted)', () => {
    it('applies default label filter after registerSearch is called', () => {
      const { result } = renderHook(() => useSelectItems({ items: flat }));

      act(() => {
        result.current.registerSearch();
      });

      act(() => {
        result.current.handleInputValueChange('Option 1');
      });

      const filtered = result.current.filteredItemsForRoot as SelectItemData[];
      expect(filtered).toHaveLength(1);
      expect(filtered[0].value).toBe('opt1');
    });

    it('restores all items when registerSearch cleanup is called', () => {
      const { result } = renderHook(() => useSelectItems({ items: flat }));

      let cleanup: () => void;
      act(() => {
        cleanup = result.current.registerSearch();
      });

      act(() => {
        result.current.handleInputValueChange('Option 1');
      });
      expect(result.current.filteredItemsForRoot).toHaveLength(1);

      act(() => {
        cleanup();
      });

      expect(result.current.filteredItemsForRoot).toEqual(flat);
    });

    it('filters within groups and removes empty groups', () => {
      const { result } = renderHook(() => useSelectItems({ items: grouped }));

      act(() => {
        result.current.registerSearch();
      });

      act(() => {
        result.current.handleInputValueChange('Apple');
      });

      const filtered = result.current.filteredItemsForRoot as {
        value: string;
        items: SelectItemData[];
      }[];
      expect(filtered).toHaveLength(1);
      expect(filtered[0].value).toBe('Fruits');
      expect(filtered[0].items).toHaveLength(1);
      expect(filtered[0].items[0].value).toBe('apple');
    });

    it('uses a custom filter when provided', () => {
      const customFilter = (item: SelectItemData, query: string): boolean =>
        item.value.startsWith(query);

      const { result } = renderHook(() =>
        useSelectItems({ items: flat, filter: customFilter }),
      );

      act(() => {
        result.current.registerSearch();
      });

      act(() => {
        result.current.handleInputValueChange('opt2');
      });

      const filtered = result.current.filteredItemsForRoot as SelectItemData[];
      expect(filtered).toHaveLength(1);
      expect(filtered[0].value).toBe('opt2');
    });

    it('disables filtering when filter is null', () => {
      const { result } = renderHook(() =>
        useSelectItems({ items: flat, filter: null }),
      );

      act(() => {
        result.current.registerSearch();
      });

      act(() => {
        result.current.handleInputValueChange('Option 1');
      });

      expect(result.current.filteredItemsForRoot).toEqual(flat);
    });

    it('returns all items when the input is whitespace-only', () => {
      const { result } = renderHook(() => useSelectItems({ items: flat }));

      act(() => {
        result.current.registerSearch();
      });

      act(() => {
        result.current.handleInputValueChange('   ');
      });

      expect(result.current.filteredItemsForRoot).toEqual(flat);
    });
  });

  describe('external filteredItems', () => {
    it('uses filteredItems instead of internal filtering when provided', () => {
      const external: SelectItemData[] = [
        { value: 'opt3', label: 'Option 3' },
      ];

      const { result } = renderHook(() =>
        useSelectItems({ items: flat, filteredItems: external }),
      );

      expect(result.current.filteredItemsForRoot).toEqual(external);
    });

    it('groups external filteredItems when items are grouped', () => {
      const external: SelectItemData[] = [
        { value: 'apple', label: 'Apple', group: 'Fruits' },
        { value: 'carrot', label: 'Carrot', group: 'Vegetables' },
      ];

      const { result } = renderHook(() =>
        useSelectItems({ items: grouped, filteredItems: external }),
      );

      const filtered = result.current.filteredItemsForRoot as {
        value: string;
        items: SelectItemData[];
      }[];
      expect(filtered).toHaveLength(2);
      expect(filtered[0].value).toBe('Fruits');
      expect(filtered[1].value).toBe('Vegetables');
    });
  });

  describe('inputValue', () => {
    it('calls onInputValueChange when handleInputValueChange is called', () => {
      const onInputValueChange = vi.fn();

      const { result } = renderHook(() =>
        useSelectItems({ items: flat, onInputValueChange }),
      );

      act(() => {
        result.current.handleInputValueChange('test');
      });

      expect(onInputValueChange).toHaveBeenCalledWith('test');
      expect(result.current.resolvedInputValue).toBe('test');
    });

    it('supports controlled inputValue', () => {
      const { result, rerender } = renderHook(
        ({ inputValue }) => useSelectItems({ items: flat, inputValue }),
        { initialProps: { inputValue: 'initial' } },
      );

      expect(result.current.resolvedInputValue).toBe('initial');

      rerender({ inputValue: 'updated' });

      expect(result.current.resolvedInputValue).toBe('updated');
    });

    it('uses defaultInputValue as the initial uncontrolled value', () => {
      const { result } = renderHook(() =>
        useSelectItems({ items: flat, defaultInputValue: 'default' }),
      );

      expect(result.current.resolvedInputValue).toBe('default');
    });
  });
});
