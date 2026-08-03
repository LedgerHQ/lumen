import { describe, expect, it } from '@jest/globals';
import { renderHook } from '@testing-library/react-native';

import { useDonutSeries } from './useDonutSeries';

describe('useDonutSeries', () => {
  it.each([
    {
      segments: [
        { id: 'a', label: 'a', value: 70 },
        { id: 'b', label: 'b', value: 20 },
        { id: 'c', label: 'c', value: 10 },
      ],
      opts: {
        other: { id: 'other', label: 'Other' },
      },
      expected: {
        segments: [
          { id: 'a', label: 'a', value: 70 },
          { id: 'b', label: 'b', value: 20 },
          { id: 'c', label: 'c', value: 10 },
        ],
        others: [],
      },
      description:
        'returns segments unchanged when already sorted and grouping does not apply',
    },
    {
      segments: [
        { id: 'b', label: 'b', value: 20 },
        { id: 'a', label: 'a', value: 70 },
        { id: 'c', label: 'c', value: 10 },
      ],
      opts: {
        other: { id: 'other', label: 'Other' },
      },
      expected: {
        segments: [
          { id: 'a', label: 'a', value: 70 },
          { id: 'b', label: 'b', value: 20 },
          { id: 'c', label: 'c', value: 10 },
        ],
        others: [],
      },
      description: 'sorts segments by value descending',
    },
    {
      segments: [
        { id: 'a', label: 'a', value: 50 },
        { id: 'b', label: 'b', value: 25 },
        { id: 'c', label: 'c', value: 20 },
        { id: 'd', label: 'd', value: 3 },
        { id: 'e', label: 'e', value: 2 },
      ],
      opts: {
        minShare: 0.04,
        other: { id: 'other', label: 'Other' },
      },
      expected: {
        segments: [
          { id: 'a', label: 'a', value: 50 },
          { id: 'b', label: 'b', value: 25 },
          { id: 'c', label: 'c', value: 20 },
          {
            id: 'other',
            label: 'Other',
            value: 5,
          },
        ],
        others: [
          { id: 'd', label: 'd', value: 3 },
          { id: 'e', label: 'e', value: 2 },
        ],
      },
      description: 'group fragments that are below a custom minShare',
    },
    {
      segments: [
        { id: 'a', label: 'a', value: 100 },
        { id: 'b', label: 'b', value: 50 },
        { id: 'c', label: 'c', value: 30 },
        { id: 'd', label: 'd', value: 3 },
        { id: 'e', label: 'e', value: 2 },
      ],
      opts: {
        minShare: 0.04,
        other: { id: 'other', label: 'Other' },
      },
      expected: {
        segments: [
          { id: 'a', label: 'a', value: 100 },
          { id: 'b', label: 'b', value: 50 },
          { id: 'c', label: 'c', value: 30 },
          {
            id: 'other',
            label: 'Other',
            value: 5,
          },
        ],
        others: [
          { id: 'd', label: 'd', value: 3 },
          { id: 'e', label: 'e', value: 2 },
        ],
      },
      description:
        'group fragments that are below a custom minShare, even with larger values',
    },
    {
      segments: [
        { id: 'a', label: 'a', value: 10 },
        { id: 'b', label: 'b', value: 10 },
        { id: 'c', label: 'c', value: 10 },
        { id: 'd', label: 'd', value: 10 },
        { id: 'e', label: 'e', value: 10 },
        { id: 'f', label: 'f', value: 10 },
        { id: 'g', label: 'g', value: 10 },
        { id: 'h', label: 'h', value: 10 },
        { id: 'i', label: 'i', value: 10 },
        { id: 'j', label: 'j', value: 10 },
      ],
      opts: {
        other: { id: 'other', label: 'Other' },
      },
      expected: {
        segments: [
          { id: 'a', label: 'a', value: 10 },
          { id: 'b', label: 'b', value: 10 },
          { id: 'c', label: 'c', value: 10 },
          { id: 'd', label: 'd', value: 10 },
          { id: 'e', label: 'e', value: 10 },
          { id: 'f', label: 'f', value: 10 },
          { id: 'g', label: 'g', value: 10 },
          {
            id: 'other',
            label: 'Other',
            value: 30,
          },
        ],
        others: [
          { id: 'h', label: 'h', value: 10 },
          { id: 'i', label: 'i', value: 10 },
          { id: 'j', label: 'j', value: 10 },
        ],
      },
      description:
        'group segments even if they are above the minShare, if the maxSegments is exceeded',
    },
    {
      segments: [
        { id: 'a', label: 'a', value: 10 },
        { id: 'b', label: 'b', value: 10 },
        { id: 'c', label: 'c', value: 10 },
        { id: 'd', label: 'd', value: 10 },
        { id: 'e', label: 'e', value: 10 },
        { id: 'f', label: 'f', value: 10 },
        { id: 'g', label: 'g', value: 10 },
        { id: 'h', label: 'h', value: 10 },
        { id: 'i', label: 'i', value: 10 },
        { id: 'j', label: 'j', value: 10 },
      ],
      opts: {
        other: { id: 'other', label: 'Other' },
        maxSegments: 3,
      },
      expected: {
        segments: [
          { id: 'a', label: 'a', value: 10 },
          { id: 'b', label: 'b', value: 10 },
          { id: 'c', label: 'c', value: 10 },
          {
            id: 'other',
            label: 'Other',
            value: 70,
          },
        ],
        others: [
          { id: 'd', label: 'd', value: 10 },
          { id: 'e', label: 'e', value: 10 },
          { id: 'f', label: 'f', value: 10 },
          { id: 'g', label: 'g', value: 10 },
          { id: 'h', label: 'h', value: 10 },
          { id: 'i', label: 'i', value: 10 },
          { id: 'j', label: 'j', value: 10 },
        ],
      },
      description:
        'group segments that are above the minShare, if the custom maxSegments is exceeded',
    },
    {
      segments: [
        { id: 'a', label: 'a', value: 10 },
        { id: 'b', label: 'b', value: 10 },
        { id: 'c', label: 'c', value: 10 },
        { id: 'd', label: 'd', value: 10 },
        { id: 'e', label: 'e', value: 10 },
        { id: 'f', label: 'f', value: 10 },
        { id: 'g', label: 'g', value: 10 },
        { id: 'h', label: 'h', value: 10 },
      ],
      opts: {
        other: { id: 'other', label: 'Other' },
      },
      expected: {
        segments: [
          { id: 'a', label: 'a', value: 10 },
          { id: 'b', label: 'b', value: 10 },
          { id: 'c', label: 'c', value: 10 },
          { id: 'd', label: 'd', value: 10 },
          { id: 'e', label: 'e', value: 10 },
          { id: 'f', label: 'f', value: 10 },
          { id: 'g', label: 'g', value: 10 },
          { id: 'h', label: 'h', value: 10 },
        ],
        others: [],
      },
      description:
        'keep a one-segment tail as-is, exceeding maxSegments by one, rather than aggregate it',
    },
    {
      segments: [
        { id: 'a', label: 'a', value: 50 },
        { id: 'b', label: 'b', value: 25 },
        { id: 'c', label: 'c', value: 20 },
        { id: 'd', label: 'd', value: 5 },
      ],
      opts: {
        minShare: 0.06,
        other: { id: 'other', label: 'Other' },
      },
      expected: {
        segments: [
          { id: 'a', label: 'a', value: 50 },
          { id: 'b', label: 'b', value: 25 },
          { id: 'c', label: 'c', value: 20 },
          { id: 'd', label: 'd', value: 5 },
        ],
        others: [],
      },
      description:
        'keep a lone segment below minShare as-is rather than aggregate it',
    },
    {
      segments: [
        { id: 'a', label: 'a', value: 40 },
        { id: 'b', label: 'b', value: 30 },
        { id: 'c', label: 'c', value: 30 },
      ],
      opts: {
        minShare: 1,
        other: { id: 'other', label: 'Other' },
      },
      expected: {
        segments: [
          { id: 'a', label: 'a', value: 40 },
          {
            id: 'other',
            label: 'Other',
            value: 60,
          },
        ],
        others: [
          { id: 'b', label: 'b', value: 30 },
          { id: 'c', label: 'c', value: 30 },
        ],
      },
      description:
        'keep the top segment when minShare is out of range, instead of collapsing to a single aggregate',
    },
  ])('should $description', ({ segments, opts, expected }) => {
    const { result } = renderHook(() => useDonutSeries(segments, opts));
    expect(result.current).toEqual(expected);
  });

  it('does not reorder the caller’s array', () => {
    const segments = [
      { id: 'b', label: 'b', value: 20 },
      { id: 'a', label: 'a', value: 70 },
    ];
    renderHook(() =>
      useDonutSeries(segments, { other: { id: 'other', label: 'Other' } }),
    );
    expect(segments.map((segment) => segment.id)).toEqual(['b', 'a']);
  });
});
