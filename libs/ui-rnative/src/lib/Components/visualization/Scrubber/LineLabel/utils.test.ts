import { describe, expect, it } from '@jest/globals';

import { resolveLineLabelContext } from './utils';

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
