import { describe, expect, it } from 'vitest';
import { sliceGroupItems } from './sliceGroupItems';

describe('sliceGroupItems', () => {
  it('should keep every item when within maxVisible', () => {
    expect(sliceGroupItems([1, 2, 3], 3)).toEqual({
      visibleItems: [1, 2, 3],
      overflowCount: 0,
    });
  });

  it('should reserve one slot for the overflow badge', () => {
    const { visibleItems, overflowCount } = sliceGroupItems(
      Array.from({ length: 10 }, (_, i) => i),
      4,
    );

    expect(visibleItems).toHaveLength(3);
    expect(overflowCount).toBe(7);
  });

  it('should default maxVisible to 4', () => {
    const { visibleItems, overflowCount } = sliceGroupItems([1, 2, 3, 4, 5]);

    expect(visibleItems).toEqual([1, 2, 3]);
    expect(overflowCount).toBe(2);
  });

  it('should cap the displayed overflow count at 99', () => {
    const { overflowCount } = sliceGroupItems(new Array(500).fill(0), 4);

    expect(overflowCount).toBe(99);
  });

  it('should keep only the overflow slot for a maxVisible below 1', () => {
    const { visibleItems, overflowCount } = sliceGroupItems([1, 2, 3], 0);

    expect(visibleItems).toHaveLength(0);
    expect(overflowCount).toBe(3);
  });
});
