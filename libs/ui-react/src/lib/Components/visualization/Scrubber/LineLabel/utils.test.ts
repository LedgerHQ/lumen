import { describe, expect, it } from 'vitest';

import { chartConfig } from '../../config';
import {
  computeLineLabelX,
  computeLineLabelY,
  resolveLineLabelContext,
} from './utils';

const area = { x: 10, y: 30, width: 200, height: 100 };

describe('resolveLineLabelContext', () => {
  it('falls back to the index when the axis has no data', () => {
    expect(resolveLineLabelContext(3, undefined)).toEqual({
      dataIndex: 3,
      value: 3,
      label: '3',
    });
  });

  it('uses the string label at the index', () => {
    expect(resolveLineLabelContext(1, { data: ['Jan', 'Feb', 'Mar'] })).toEqual(
      { dataIndex: 1, value: 'Feb', label: 'Feb' },
    );
  });

  it('formats the value like the axis tick labels', () => {
    const context = resolveLineLabelContext(2, {
      data: [100, 200, 300],
      tickLabelFormatter: (value) => `${value}px`,
    });
    expect(context).toEqual({ dataIndex: 2, value: 300, label: '300px' });
  });
});

describe('computeLineLabelX', () => {
  it('centers the label on the line', () => {
    expect(computeLineLabelX(100, 40, area)).toBe(80);
  });

  it('clamps to the left edge of the drawing area', () => {
    expect(computeLineLabelX(15, 40, area)).toBe(area.x);
  });

  it('clamps to the right edge of the drawing area', () => {
    expect(computeLineLabelX(205, 40, area)).toBe(area.x + area.width - 40);
  });
});

describe('computeLineLabelY', () => {
  it('places the label above the drawing area', () => {
    const { gap, height } = chartConfig.lineLabel;
    expect(computeLineLabelY(area)).toBe(area.y - gap - height);
  });
});
