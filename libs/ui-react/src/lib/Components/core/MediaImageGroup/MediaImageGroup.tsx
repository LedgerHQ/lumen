import {
  cn,
  DisabledProvider,
  useDisabledContext,
  DEFAULT_GROUP_MAX_VISIBLE,
  sliceGroupItems,
  formatGroupOverflowCount,
} from '@ledgerhq/lumen-utils-shared';
import { cva } from 'class-variance-authority';
import { useMemo } from 'react';
import { MediaImage } from '../MediaImage';
import type { MediaImageGroupItem, MediaImageGroupProps } from './types';

const mediaImageGroupVariants = {
  slot: cva(
    'relative flex shrink-0 overflow-hidden bg-base ring-base-inverted first:ml-0',
    {
      variants: {
        size: {
          12: '-ml-2 rounded-xs ring',
          16: '-ml-2 rounded-xs ring',
          20: '-ml-4 rounded-xs ring',
          24: '-ml-4 rounded-sm ring',
          32: '-ml-6 rounded-sm ring',
          40: '-ml-6 rounded-md ring-2',
          48: '-ml-8 rounded-md ring-2',
          56: '-ml-10 rounded-lg ring-2',
          64: '-ml-12 rounded-lg ring-2',
          72: '-ml-12 rounded-lg ring-2',
        },
        shape: {
          square: '',
          circle: 'rounded-full',
        },
      },
    },
  ),
  overflow: cva(
    'flex items-center justify-center bg-interactive text-on-interactive select-none',
    {
      variants: {
        size: {
          12: 'h-12 w-auto min-w-12 rounded-xs px-2 body-4-semi-bold',
          16: 'h-16 w-auto min-w-16 rounded-xs px-2 body-4-semi-bold',
          20: 'h-20 w-auto min-w-20 rounded-xs px-2 body-4-semi-bold',
          24: 'h-24 w-auto min-w-24 rounded-sm px-2 body-4-semi-bold',
          32: 'h-32 w-auto min-w-32 rounded-sm px-2 body-3-semi-bold',
          40: 'h-40 w-auto min-w-40 rounded-md px-2 body-2-semi-bold',
          48: 'h-48 w-auto min-w-48 rounded-md px-2 body-1-semi-bold',
          56: 'h-56 w-auto min-w-56 rounded-lg px-2 heading-4-semi-bold',
          64: 'h-64 w-auto min-w-64 rounded-lg px-2 heading-3-semi-bold',
          72: 'h-72 w-auto min-w-72 rounded-lg px-2 heading-2-semi-bold',
        },
        shape: {
          square: '',
          circle: 'rounded-full',
        },
        disabled: {
          true: 'opacity-30',
          false: '',
        },
      },
    },
  ),
};

type OverflowBadgeProps = Pick<
  MediaImageGroupProps,
  'size' | 'shape' | 'overflowTestID' | 'overflowLabel'
> &
  Required<Pick<MediaImageGroupProps, 'size' | 'shape'>> & { count: number };

const OverflowBadge = ({
  count,
  size,
  shape,
  overflowTestID,
  overflowLabel,
}: OverflowBadgeProps) => {
  const disabled = useDisabledContext({ consumerName: 'MediaImageGroup' });

  return (
    <div className={cn(mediaImageGroupVariants.slot({ size, shape }))}>
      <span
        className={cn(
          mediaImageGroupVariants.overflow({ size, shape, disabled }),
        )}
        data-testid={overflowTestID}
        role={overflowLabel ? 'img' : undefined}
        aria-label={overflowLabel}
      >
        {formatGroupOverflowCount(count)}
      </span>
    </div>
  );
};

/**
 * Displays a stack of overlapping media images, with a `+N` badge when the
 * data exceeds `maxVisible`.
 *
 * The group owns `size` and `shape`. A custom `renderItem` receives them and
 * must forward them to the rendered element (e.g. a crypto icon). Items are
 * clipped to the group's ring, so decorations overhanging an item, such as a
 * network badge, are not supported.
 *
 * Without `renderItem`, `data` must be `MediaImage` props; any other item type
 * requires `renderItem`.
 *
 * @example
 * import { MediaImageGroup } from '@ledgerhq/lumen-ui-react';
 *
 * <MediaImageGroup
 *   size={32}
 *   data={[
 *     { src: btcUrl, alt: 'Bitcoin' },
 *     { src: ethUrl, alt: 'Ethereum' },
 *   ]}
 * />
 *
 * <MediaImageGroup
 *   data={assets} // [{ ledgerId: 'bitcoin', ticker: 'BTC' }, ...]
 *   renderItem={(asset, { size, shape }) => (
 *     <CryptoIcon ledgerId={asset.ledgerId} ticker={asset.ticker} size={size} shape={shape} />
 *   )}
 * />
 */
export function MediaImageGroup<T = MediaImageGroupItem>({
  ref,
  data,
  renderItem,
  size = 32,
  shape = 'circle',
  maxVisible = DEFAULT_GROUP_MAX_VISIBLE,
  disabled: disabledProp = false,
  overflowTestID,
  overflowLabel,
  className,
  ...props
}: MediaImageGroupProps<T>) {
  const disabled = useDisabledContext({
    consumerName: 'MediaImageGroup',
    mergeWith: { disabled: disabledProp },
  });
  const { visibleItems, overflowCount } = useMemo(
    () => sliceGroupItems<unknown>(data, maxVisible),
    [data, maxVisible],
  );

  if (data.length === 0) {
    return null;
  }

  return (
    <div
      ref={ref}
      role='group'
      className={cn('inline-flex items-center', className)}
      {...props}
    >
      <DisabledProvider value={{ disabled }}>
        {renderItem
          ? data.slice(0, visibleItems.length).map((item, index) => (
              <div
                key={index}
                className={cn(mediaImageGroupVariants.slot({ size, shape }))}
              >
                {renderItem(item, { size, shape })}
              </div>
            ))
          : data
              .slice(0, visibleItems.length)
              .map(({ id, ...imageProps }, index) => (
                <div
                  key={id ?? index}
                  className={cn(mediaImageGroupVariants.slot({ size, shape }))}
                >
                  <MediaImage {...imageProps} size={size} shape={shape} />
                </div>
              ))}
        {overflowCount > 0 && (
          <OverflowBadge
            count={overflowCount}
            size={size}
            shape={shape}
            overflowTestID={overflowTestID}
            overflowLabel={overflowLabel}
          />
        )}
      </DisabledProvider>
    </div>
  );
}
