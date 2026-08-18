import { cssVar } from '@ledgerhq/lumen-design-core';
import { Button, InteractiveIcon } from '@ledgerhq/lumen-ui-react';
import { ChevronRight } from '@ledgerhq/lumen-ui-react/symbols';
import { cn } from '@ledgerhq/lumen-utils-shared';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { useEffect, useState } from 'react';

import { StoryDecorator } from '../../../../../.storybook/StoryDecorator';
import { Legend } from '../../Legend';
import { DonutChart } from '../DonutChart';
import { DonutChartCenter } from '../DonutChartCenter';
import { DonutChartDescription } from '../DonutChartDescription';
import { DonutChartTitle } from '../DonutChartTitle';
import type { DonutSegment } from '../types';
import { useDonutSeries } from '../useDonutSeries';

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
      color: segmentPalette[index % segmentPalette.length],
    };
  });

const LOAD_REPLAY_DELAY_MS = 1500;
/**
 * The ring adapts to any number of segments, rendered in series order,
 * clockwise from 12 o'clock, with rounded caps and gaps between segments.
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
 * A value too small to draw to scale is still given a minimum arc, so it stays
 * visible and hoverable instead of collapsing into a gap; the room it needs
 * comes proportionally out of the larger segments. Only the geometry is
 * inflated — the label keeps the true share and reads `<0.1%` rather than `0%`.
 * When a long tail of these carries no meaning on its own, condense it with
 * `useDonutSeries` instead (see `WithPreparedSeries`).
 */
export const WithTinyValues: Story = {
  args: {
    series: [
      { ...cryptoSegments[0], value: 60 },
      { ...cryptoSegments[1], value: 40 },
      { id: 'dust', label: 'Dust', value: 0.00001 },
    ],
    defaultActiveId: 'dust',
    renderCenter: ({ activeSegment }) => (
      <DonutChartCenter>
        <DonutChartTitle size='sm'>
          {activeSegment?.percentLabel ?? '100%'}
        </DonutChartTitle>
        <DonutChartDescription>
          {activeSegment?.label ?? 'Total'}
        </DonutChartDescription>
      </DonutChartCenter>
    ),
  },
};

/**
 * With no data (empty or all-zero series), the ring renders the static
 * placeholder shape shared with the loading state.
 */
export const NoData: Story = {
  args: {
    series: [],
    renderCenter: () => (
      <DonutChartCenter>
        <DonutChartDescription>No data</DonutChartDescription>
      </DonutChartCenter>
    ),
  },
};

/**
 * While loading, the ring shows the animated placeholder wave instead of the
 * real segments, regardless of `series`.
 */
export const Loading: Story = {
  parameters: {
    chromatic: { pauseAnimationAtEnd: true },
  },
  args: {
    loading: true,
  },
};

/**
 * Segments are hoverable by default. Hovering a segment sets `activeId`, dims
 * the others, and pops the active segment out radially. Leaving the chart resets
 * `activeId` to `null`.
 */
export const Interactive: Story = {};

/**
 * Pair the ring with `Legend`: pass it the same `series`. The legend wraps
 * within the width it is given.
 */
export const WithLegend: Story = {
  render: (args) => (
    <div className='flex items-center gap-24'>
      <DonutChart {...args} />
      <Legend series={args.series} className='max-w-176' />
    </div>
  ),
};

/**
 * Lift `activeId` into parent state to drive the chart center or other slots
 * from the same contract.
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
 * to active content on segment hover. Typography scales with the ring, so the
 * same pattern fits both sizes — the tighter `sm` center drops the trailing
 * icon.
 */
export const WithCenter: Story = {
  render: (args) => (
    <div className='flex flex-wrap items-center gap-32'>
      {(['md', 'sm'] as const).map((size) => (
        <div key={size} className='flex flex-col items-center gap-8'>
          <DonutChart
            {...args}
            size={size}
            defaultActiveId={null}
            renderCenter={({ series }) => (
              <DonutChartCenter>
                <DonutChartTitle>{series.length}</DonutChartTitle>
              </DonutChartCenter>
            )}
            renderCenterActive={({ activeSegment }) => (
              <DonutChartCenter>
                <DonutChartTitle size='sm'>
                  {activeSegment.percentLabel}
                </DonutChartTitle>
                <DonutChartDescription>
                  <span className='min-w-0 truncate'>
                    {activeSegment.label}
                  </span>
                  {size === 'md' && (
                    <InteractiveIcon
                      iconType='stroked'
                      icon={ChevronRight}
                      size={16}
                      aria-label={`View ${activeSegment.label} details`}
                    />
                  )}
                </DonutChartDescription>
              </DonutChartCenter>
            )}
          />
          <span className='body-3 text-muted'>{size}</span>
        </div>
      ))}
    </div>
  ),
};

/**
 * Consumer pattern: wrap `renderCenterActive` in a `group` button so the whole
 * active block is clickable and hover on the block drives the chevron's chip
 * hover state.
 */
export const WithCenterClickable: Story = {
  render: (args) => {
    const [lastClick, setLastClick] = useState<string | null>(null);

    return (
      <div>
        <DonutChart
          {...args}
          defaultActiveId='bitcoin'
          renderCenter={({ series }) => (
            <DonutChartCenter>
              <DonutChartTitle>{series.length}</DonutChartTitle>
            </DonutChartCenter>
          )}
          renderCenterActive={({ activeSegment }) => (
            <button
              type='button'
              className='group flex cursor-pointer flex-col items-center'
              aria-label={`View ${activeSegment.label} details`}
              onClick={() => setLastClick(activeSegment.label)}
            >
              <DonutChartTitle size='sm'>
                {activeSegment.percentLabel}
              </DonutChartTitle>
              <DonutChartDescription>
                <span className='min-w-0 truncate'>
                  w;ejpewjfpewjf;ekwjfpejf; {activeSegment.label}
                </span>
                <span
                  className={cn(
                    'inline-flex size-fit items-center justify-center rounded-full',
                    'bg-base-transparent text-muted transition-colors',
                    'group-hover:bg-base-transparent-hover group-hover:text-muted-hover',
                    'group-active:bg-base-transparent-pressed group-active:text-muted-pressed',
                  )}
                >
                  <ChevronRight size={16} aria-hidden />
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

const manyCryptoSegments: DonutSegment[] = [
  {
    id: 'bitcoin',
    label: 'Bitcoin',
    value: 33,
    color: cssVar('var(--color-crypto-bitcoin)'),
  },
  {
    id: 'ethereum',
    label: 'Ethereum',
    value: 21,
    color: cssVar('var(--color-crypto-ethereum)'),
  },
  {
    id: 'tether',
    label: 'Tether',
    value: 11,
    color: cssVar('var(--color-crypto-tether-usdt)'),
  },
  {
    id: 'binance',
    label: 'BNB',
    value: 10,
    color: cssVar('var(--color-crypto-binance)'),
  },
  {
    id: 'sol',
    label: 'Solana',
    value: 7,
    color: cssVar('var(--color-crypto-sol)'),
  },
  {
    id: 'tron',
    label: 'Tron',
    value: 6,
    color: cssVar('var(--color-crypto-tron)'),
  },
  {
    id: 'usdc',
    label: 'USDC',
    value: 5,
    color: cssVar('var(--color-crypto-usdc)'),
  },
  {
    id: 'avax',
    label: 'AVAX',
    value: 5,
    color: cssVar('var(--color-crypto-avax)'),
  },
  { id: 'xrp', label: 'XRP', value: 1 },
  { id: 'cardano', label: 'Cardano', value: 1 },
  { id: 'dogecoin', label: 'Dogecoin', value: 1 },
];

/**
 * `useDonutSeries` prepares a raw series before it reaches the chart: it sorts
 * segments by `value` descending, then condenses the long tail into a single
 * "Other" segment.
 */

const lightContrastSegments: DonutSegment[] = [
  { id: 'a', label: 'Amber', value: 40, color: '#fefae8' },
  { id: 'b', label: 'Sky', value: 35, color: '#e8f6fe' },
  { id: 'c', label: 'Coral', value: 25, color: '#fef0ec' },
];

const darkContrastSegments: DonutSegment[] = [
  { id: 'd', label: 'Forest', value: 40, color: '#0a1f13' },
  { id: 'e', label: 'Navy', value: 35, color: '#060d1f' },
  { id: 'f', label: 'Plum', value: 25, color: '#160820' },
];

export const WithColorContrast: Story = {
  render: () => (
    <div className='flex flex-col gap-24'>
      <div className='flex items-end gap-32'>
        <div className='flex flex-col items-center gap-8'>
          <DonutChart series={lightContrastSegments} />
          <span className='body-3 text-muted'>original</span>
        </div>
        <div className='flex flex-col items-center gap-8'>
          <DonutChart series={lightContrastSegments} enableColorContrast />
          <span className='body-3 text-muted'>contrast-safe</span>
        </div>
      </div>
      <div className='flex items-end gap-32'>
        <div className='flex flex-col items-center gap-8'>
          <DonutChart series={darkContrastSegments} />
          <span className='body-3 text-muted'>original</span>
        </div>
        <div className='flex flex-col items-center gap-8'>
          <DonutChart series={darkContrastSegments} enableColorContrast />
          <span className='body-3 text-muted'>contrast-safe</span>
        </div>
      </div>
    </div>
  ),
};

export const WithPreparedSeries: Story = {
  render: () => {
    const { segments } = useDonutSeries(manyCryptoSegments, {
      other: { label: 'Other' },
    });
    return (
      <DonutChart
        series={segments}
        defaultActiveId={null}
        renderCenter={({ series }) => (
          <DonutChartCenter>
            <DonutChartTitle>{series.length}</DonutChartTitle>
          </DonutChartCenter>
        )}
        renderCenterActive={({ activeSegment }) => (
          <DonutChartCenter>
            <DonutChartTitle size='sm'>
              {activeSegment.percentLabel}
            </DonutChartTitle>
            <DonutChartDescription>{activeSegment.label}</DonutChartDescription>
          </DonutChartCenter>
        )}
      />
    );
  },
};

/**
 * A long center label in the `sm` hole should truncate instead of overflowing
 * the ring. Hover to swap the resting total for the active name.
 */
export const ResponsivenessShowcase: Story = {
  args: {
    size: 'sm',
    series: [
      {
        ...cryptoSegments[0],
        label: 'A very long allocation name that should truncate',
      },
      cryptoSegments[1],
      cryptoSegments[2],
    ],
    defaultActiveId: 'bitcoin',
    renderCenter: () => (
      <DonutChartCenter>
        <DonutChartDescription>
          Total portfolio allocation overview
        </DonutChartDescription>
      </DonutChartCenter>
    ),
    renderCenterActive: ({ activeSegment }) => (
      <DonutChartCenter>
        <DonutChartTitle size='sm'>
          {activeSegment.percentLabel}
        </DonutChartTitle>
        <DonutChartDescription>{activeSegment.label}</DonutChartDescription>
      </DonutChartCenter>
    ),
  },
};

export const ResponsivenessShowcaseWithReactNode: Story = {
  args: {
    series: [
      {
        ...cryptoSegments[0],
        label: 'A very long allocation name that should truncate',
      },
      cryptoSegments[1],
      cryptoSegments[2],
    ],
    defaultActiveId: 'bitcoin',
    renderCenter: () => (
      <DonutChartCenter>
        <DonutChartTitle>Very long title that should truncate</DonutChartTitle>
        <DonutChartDescription>
          <span className='min-w-0 truncate'>
            Total portfolio allocation overview
          </span>
          <InteractiveIcon
            iconType='stroked'
            icon={ChevronRight}
            size={16}
            aria-label='View total portfolio allocation overview details'
          />
        </DonutChartDescription>
      </DonutChartCenter>
    ),
  },
};

/**
 * Flips `loading` off so the reveal animation remounts the ring. Replay to
 * watch CSS mask cost; the ring should remount once, not on every hover after.
 */
export const LoadingToData: Story = {
  parameters: {
    chromatic: { pauseAnimationAtEnd: true },
  },
  render: (args) => {
    const [loading, setLoading] = useState(false);

    useEffect(() => {
      if (!loading) {
        return;
      }
      const timeoutId = window.setTimeout(() => {
        setLoading(false);
      }, LOAD_REPLAY_DELAY_MS);
      return () => window.clearTimeout(timeoutId);
    }, [loading]);

    return (
      <div className='flex flex-col items-center gap-16'>
        <DonutChart
          {...args}
          loading={loading}
          renderCenter={({ series }) =>
            loading ? null : (
              <DonutChartCenter>
                <DonutChartTitle>{series.length}</DonutChartTitle>
              </DonutChartCenter>
            )
          }
          renderCenterActive={({ activeSegment }) => (
            <DonutChartCenter>
              <DonutChartTitle size='sm'>
                {activeSegment.percentLabel}
              </DonutChartTitle>
              <DonutChartDescription>
                {activeSegment.label}
              </DonutChartDescription>
            </DonutChartCenter>
          )}
        />
        <Button
          appearance='gray'
          size='sm'
          loading={loading}
          onClick={() => setLoading(true)}
        >
          Replay load
        </Button>
      </div>
    );
  },
};
