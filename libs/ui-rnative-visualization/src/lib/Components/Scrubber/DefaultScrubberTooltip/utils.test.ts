import { describe, expect, it, jest } from '@jest/globals';

import {
  LABEL_VALUE_GAP,
  PADDING_X,
  PADDING_Y,
  ROW_GAP,
  ROW_HEIGHT,
  TITLE_GAP,
} from './constants';
import {
  computeItemsBaseY,
  computeTooltipHeight,
  computeTooltipWidth,
  computeTooltipX,
  measureWidths,
  safeGetBBoxWidth,
} from './utils';

describe('safeGetBBoxWidth', () => {
  it('returns 0 for null', async () => {
    expect(await safeGetBBoxWidth(null)).toBe(0);
  });

  it('returns the width from getBBox', async () => {
    const el = { getBBox: async () => ({ width: 42 }) };
    expect(await safeGetBBoxWidth(el)).toBe(42);
  });

  it('returns 0 when getBBox resolves to undefined', async () => {
    const el = { getBBox: async () => undefined };
    expect(await safeGetBBoxWidth(el)).toBe(0);
  });

  it('returns 0 when getBBox throws', async () => {
    const el = {
      getBBox: async () => {
        throw new Error('not supported');
      },
    };
    expect(await safeGetBBoxWidth(el)).toBe(0);
  });
});

describe('computeTooltipWidth', () => {
  it('returns minWidth when widths is null', () => {
    expect(computeTooltipWidth(null, false, 80)).toBe(80);
  });

  it('returns minWidth when computed fit is smaller', () => {
    const widths = { title: 0, labels: [10], values: [10] };
    const fitWidth = 10 + LABEL_VALUE_GAP + 10 + PADDING_X * 2;
    expect(computeTooltipWidth(widths, false, fitWidth + 50)).toBe(
      fitWidth + 50,
    );
  });

  it('returns fit width when it exceeds minWidth', () => {
    const widths = { title: 0, labels: [200], values: [200] };
    const expected = 200 + LABEL_VALUE_GAP + 200 + PADDING_X * 2;
    expect(computeTooltipWidth(widths, false, 80)).toBe(expected);
  });

  it('accounts for title width when hasTitle is true', () => {
    const widths = { title: 300, labels: [10], values: [10] };
    const expected = 300 + PADDING_X * 2;
    expect(computeTooltipWidth(widths, true, 80)).toBe(expected);
  });

  it('ignores title width when hasTitle is false', () => {
    const widths = { title: 300, labels: [10], values: [10] };
    const rowFit = 10 + LABEL_VALUE_GAP + 10 + PADDING_X * 2;
    expect(computeTooltipWidth(widths, false, 40)).toBe(rowFit);
    expect(computeTooltipWidth(widths, false, 80)).toBe(80);
  });

  it('uses the widest row when multiple items are present', () => {
    const widths = {
      title: 0,
      labels: [10, 50],
      values: [10, 50],
    };
    const widestRow = 50 + LABEL_VALUE_GAP + 50;
    const expected = widestRow + PADDING_X * 2;
    expect(computeTooltipWidth(widths, false, 80)).toBe(expected);
  });
});

describe('computeTooltipX', () => {
  const drawingArea = { x: 0, y: 0, width: 400, height: 200 };

  it('places tooltip to the right when there is enough space', () => {
    expect(computeTooltipX(100, 10, 80, drawingArea)).toBe(110);
  });

  it('flips to the left when placing right would overflow', () => {
    expect(computeTooltipX(350, 10, 80, drawingArea)).toBe(260);
  });

  it('clamps to drawingArea.x when flipped position is negative', () => {
    expect(computeTooltipX(195, 10, 200, drawingArea)).toBe(0);
  });

  it('clamps the right-side position to not overflow the right edge', () => {
    expect(computeTooltipX(100, 10, 400, drawingArea)).toBe(0);
  });

  it('respects a non-zero drawingArea.x as the minimum clamp', () => {
    const area = { x: 20, y: 0, width: 400, height: 200 };
    expect(computeTooltipX(5, 10, 200, area)).toBe(20);
  });

  it('respects a custom offset', () => {
    expect(computeTooltipX(100, 20, 80, drawingArea)).toBe(120);
  });
});

describe('computeTooltipHeight', () => {
  it('computes height for a single item without a title', () => {
    const expected = PADDING_Y * 2 + ROW_HEIGHT;
    expect(computeTooltipHeight(1, false)).toBe(expected);
  });

  it('adds the title block height when hasTitle is true', () => {
    const titleBlockHeight = ROW_HEIGHT + TITLE_GAP;
    const expected = PADDING_Y * 2 + titleBlockHeight + ROW_HEIGHT;
    expect(computeTooltipHeight(1, true)).toBe(expected);
  });

  it('adds row gaps for multiple items', () => {
    const itemCount = 3;
    const expected =
      PADDING_Y * 2 + itemCount * ROW_HEIGHT + (itemCount - 1) * ROW_GAP;
    expect(computeTooltipHeight(itemCount, false)).toBe(expected);
  });

  it('combines title block and row gaps correctly', () => {
    const itemCount = 2;
    const titleBlockHeight = ROW_HEIGHT + TITLE_GAP;
    const expected =
      PADDING_Y * 2 +
      titleBlockHeight +
      itemCount * ROW_HEIGHT +
      (itemCount - 1) * ROW_GAP;
    expect(computeTooltipHeight(itemCount, true)).toBe(expected);
  });
});

describe('computeItemsBaseY', () => {
  it('returns drawingAreaY + PADDING_Y when there is no title', () => {
    expect(computeItemsBaseY(10, false)).toBe(10 + PADDING_Y);
  });

  it('adds the title block height when hasTitle is true', () => {
    const titleBlockHeight = ROW_HEIGHT + TITLE_GAP;
    expect(computeItemsBaseY(10, true)).toBe(10 + PADDING_Y + titleBlockHeight);
  });

  it('handles drawingAreaY of 0', () => {
    expect(computeItemsBaseY(0, false)).toBe(PADDING_Y);
  });
});

describe('measureWidths', () => {
  const makeBBoxEl = (width: number) => ({
    getBBox: jest.fn(async () => ({ width })),
  });

  const makeRaf = () =>
    jest
      .spyOn(global, 'requestAnimationFrame')
      .mockImplementation((cb: FrameRequestCallback) => {
        cb(0);
        return 0;
      });

  it('measures title, label and value widths after a RAF tick', async () => {
    const raf = makeRaf();

    const titleEl = makeBBoxEl(50);
    const labelEl = makeBBoxEl(30);
    const valueEl = makeBBoxEl(20);

    const items = [{ label: 'L', value: 'V' }];
    const titleRef = { current: titleEl };
    const labelRefs = { current: [labelEl] };
    const valueRefs = { current: [valueEl] };

    const result = await measureWidths(
      items,
      true,
      titleRef,
      labelRefs,
      valueRefs,
    );

    expect(result).toEqual({ title: 50, labels: [30], values: [20] });
    raf.mockRestore();
  });

  it('returns 0 for the title when hasTitle is false', async () => {
    const raf = makeRaf();

    const items = [{ label: 'L', value: 'V' }];
    const titleRef = { current: makeBBoxEl(99) };
    const labelRefs = { current: [makeBBoxEl(10)] };
    const valueRefs = { current: [makeBBoxEl(10)] };

    const result = await measureWidths(
      items,
      false,
      titleRef,
      labelRefs,
      valueRefs,
    );

    expect(result.title).toBe(0);
    raf.mockRestore();
  });

  it('measures multiple items', async () => {
    const raf = makeRaf();

    const items = [
      { label: 'A', value: '1' },
      { label: 'B', value: '2' },
    ];
    const titleRef = { current: null };
    const labelRefs = { current: [makeBBoxEl(10), makeBBoxEl(20)] };
    const valueRefs = { current: [makeBBoxEl(5), makeBBoxEl(15)] };

    const result = await measureWidths(
      items,
      false,
      titleRef,
      labelRefs,
      valueRefs,
    );

    expect(result.labels).toEqual([10, 20]);
    expect(result.values).toEqual([5, 15]);
    raf.mockRestore();
  });

  it('returns 0 for null refs', async () => {
    const raf = makeRaf();

    const items = [{ label: 'L', value: 'V' }];
    const titleRef = { current: null };
    const labelRefs = { current: [null] };
    const valueRefs = { current: [null] };

    const result = await measureWidths(
      items,
      true,
      titleRef,
      labelRefs,
      valueRefs,
    );

    expect(result).toEqual({ title: 0, labels: [0], values: [0] });
    raf.mockRestore();
  });
});
