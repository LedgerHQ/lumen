import { cssVar } from '@ledgerhq/lumen-design-core';
import { InteractiveIcon } from '@ledgerhq/lumen-ui-react';
import { ChevronRight } from '@ledgerhq/lumen-ui-react/symbols';
import { cn } from '@ledgerhq/lumen-utils-shared';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { useState } from 'react';

import { StoryDecorator } from '../../../../../.storybook/StoryDecorator';
import { DonutChart } from '../DonutChart';
import { DonutChartDescription } from '../DonutChartDescription';
import { DonutChartTitle } from '../DonutChartTitle';
import type { DonutSegment } from '../types';

const cryptoSegments: DonutSegment[] = [
  {
    id: 'bitcoin',
    label: 'Bitcoin',
    value: 45,
    color: cssVar('var(--color-crypto-bitcoin)'),
  },
  {
    id: 'ethereum',
    label: 'Ethereum',
    value: 30,
    color: cssVar('var(--color-crypto-ethereum)'),
  },
  {
    id: 'tether',
    label: 'Tether',
    value: 25,
    color: cssVar('var(--color-crypto-tether-usdt)'),
  },
];

const meta = {
  component: DonutChart,
  id: 'react-donutchart',
  title: 'Visualization/DonutChart',
  tags: ['experimental'],
  args: {
    series: cryptoSegments,
    size: 'md',
  },
  decorators: [
    (Story, context) => (
      <StoryDecorator context={context}>
        <Story />
      </StoryDecorator>
    ),
  ],
} satisfies Meta<typeof DonutChart>;

export default meta;
type Story = StoryObj<typeof DonutChart>;

/**
 * The simplest chart: a `series` of `DonutSegment`s rendered as a ring. Each
 * segment's angle is its share of the summed `value`; `color` overrides the
 * neutral default.
 */
export const Base: Story = {};

export const Sizes: Story = {
  render: (args) => (
    <div className='flex flex-wrap items-center gap-32'>
      <div className='flex flex-col items-center gap-8'>
        <DonutChart {...args} size='md' />
        <span className='body-3 text-muted'>md — 168px</span>
      </div>
      <div className='flex flex-col items-center gap-8'>
        <DonutChart {...args} size='sm' />
        <span className='body-3 text-muted'>sm — 80px</span>
      </div>
    </div>
  ),
};

/**
 * Without a `color` override, segments fall back to the neutral default grey.
 */
export const DefaultColors: Story = {
  args: {
    series: [
      { id: 'a', label: 'A', value: 45 },
      { id: 'b', label: 'B', value: 30 },
      { id: 'c', label: 'C', value: 25 },
    ],
  },
};

const segmentPalette = [
  cssVar('var(--color-crypto-bitcoin)'),
  cssVar('var(--color-crypto-ethereum)'),
  cssVar('var(--color-crypto-tether-usdt)'),
  cssVar('var(--color-crypto-binance)'),
  cssVar('var(--color-crypto-sol)'),
  cssVar('var(--color-crypto-tron)'),
  cssVar('var(--color-crypto-usdc)'),
];

const buildSegments = (count: number): DonutSegment[] =>
  Array.from({ length: count }, (_, index) => {
    const n = index + 1;
    return {
      id: `segment-${n}`,
      label: `Segment ${n}`,
      value: 1,
      color: segmentPalette[index],
    };
  });

/**
 * The ring adapts to any number of segments, rendered in series order,
 * clockwise from 12 o'clock, with rounded caps and gaps between slices.
 */
export const SegmentCounts: Story = {
  render: () => (
    <div className='flex flex-wrap items-center gap-32'>
      {[1, 2, 3, 4, 5, 6, 7].map((count) => (
        <div key={count} className='flex flex-col items-center gap-8'>
          <DonutChart series={buildSegments(count)} />
          <span className='body-3 text-muted'>
            {count} {count === 1 ? 'segment' : 'segments'}
          </span>
        </div>
      ))}
    </div>
  ),
};

/**
 * With no data (empty or all-zero series), the ring renders the faint empty
 * ring.
 */
export const NoData: Story = {
  args: {
    series: [],
  },
};

/**
 * Segments are hoverable by default. Hovering a segment sets `activeId`, dims
 * the others, and pops the active slice out radially. Leaving the chart resets
 * `activeId` to `null`.
 */
export const Interactive: Story = {};

/**
 * Lift `activeId` into parent state to drive the chart and a future legend from
 * the same contract.
 */
export const Controlled: Story = {
  render: (args) => {
    const [activeId, setActiveId] = useState<string | null>(null);
    return (
      <DonutChart
        {...args}
        activeId={activeId}
        onActiveIdChange={setActiveId}
      />
    );
  },
};

/**
 * `renderCenter` renders the resting center; `renderCenterActive` crossfades
 * to active content on segment hover.
 */
export const WithCenter: Story = {
  render: (args) => (
    <DonutChart
      {...args}
      defaultActiveId={null}
      renderCenter={({ series }) => (
        <DonutChartTitle>{series.length}</DonutChartTitle>
      )}
      renderCenterActive={({ activeSegment }) => (
        <>
          <DonutChartTitle size='sm'>{activeSegment.percent}%</DonutChartTitle>
          <DonutChartDescription>
            <span className='truncate'>{activeSegment.label}</span>
            <InteractiveIcon
              iconType='stroked'
              icon={ChevronRight}
              size={16}
              aria-label={`View ${activeSegment.label} details`}
            />
          </DonutChartDescription>
        </>
      )}
    />
  ),
};

/**
 * The same `renderCenter`/`renderCenterActive` pattern as `WithCenter`, sized
 * for the 80px `sm` ring — typography scales down automatically via
 * `donutSizeContext`.
 */
export const WithCenterSmall: Story = {
  args: {
    size: 'sm',
  },
  render: (args) => (
    <DonutChart
      {...args}
      defaultActiveId='bitcoin'
      renderCenter={({ series }) => (
        <DonutChartTitle>{series.length}</DonutChartTitle>
      )}
      renderCenterActive={({ activeSegment }) => (
        <>
          <DonutChartTitle size='sm'>{activeSegment.percent}%</DonutChartTitle>
          <DonutChartDescription>
            <span className='truncate'>{activeSegment.label}</span>
          </DonutChartDescription>
        </>
      )}
    />
  ),
};

/**
 * Consumer pattern: wrap `renderCenterActive` in a `group` button so the whole
 * active block is clickable and hover on the block drives the chevron hover
 * state (`InteractiveIcon` is decorative with `pointer-events-none`).
 */
export const WithCenterClickable: Story = {
  render: (args) => {
    const [lastClick, setLastClick] = useState<string | null>(null);

    return (
      <div>
        <DonutChart
          {...args}
          defaultActiveId={null}
          renderCenter={({ series }) => (
            <DonutChartTitle>{series.length}</DonutChartTitle>
          )}
          renderCenterActive={({ activeSegment }) => (
            <button
              type='button'
              className='group flex cursor-pointer flex-col items-center'
              aria-label={`View ${activeSegment.label} details`}
              onClick={() => setLastClick(activeSegment.label)}
            >
              <DonutChartTitle size='sm'>
                {activeSegment.percent}%
              </DonutChartTitle>
              <DonutChartDescription>
                <span className='truncate'>{activeSegment.label}</span>
                <span
                  className={cn(
                    'inline-flex size-fit items-center justify-center rounded-full',
                    'bg-base-transparent text-muted transition-colors',
                    'group-hover:bg-base-transparent-hover group-hover:text-muted-hover',
                    'group-active:bg-base-transparent-pressed group-active:text-muted-pressed',
                    '[&_button]:pointer-events-none',
                  )}
                >
                  <InteractiveIcon
                    iconType='stroked'
                    icon={ChevronRight}
                    size={16}
                    aria-hidden
                    tabIndex={-1}
                  />
                </span>
              </DonutChartDescription>
            </button>
          )}
        />
        {lastClick != null && (
          <span className='body-3 text-muted'>Clicked: {lastClick}</span>
        )}
      </div>
    );
  },
};
