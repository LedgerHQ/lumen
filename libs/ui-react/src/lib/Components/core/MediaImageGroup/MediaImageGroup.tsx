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
  slot: cva('relative flex shrink-0 overflow-hidden bg-base first:ml-0', {
    variants: {
      size: {
        12: '-ml-4 rounded-xs p-1',
        16: '-ml-4 rounded-xs p-1',
        20: '-ml-6 rounded-xs p-1',
        24: '-ml-6 rounded-sm p-1',
        32: '-ml-8 rounded-sm p-1',
        40: '-ml-10 rounded-md p-2',
        48: '-ml-12 rounded-md p-2',
        56: '-ml-14 rounded-lg p-2',
        64: '-ml-16 rounded-lg p-2',
        72: '-ml-16 rounded-lg p-2',
      },
      shape: {
        square: '',
        circle: 'rounded-full',
      },
    },
  }),
  overflow: cva(
    'flex items-center justify-center bg-interactive text-on-interactive select-none',
    {
      variants: {
        size: {
          12: 'size-12 rounded-xs body-4-semi-bold',
          16: 'size-16 rounded-xs body-4-semi-bold',
          20: 'size-20 rounded-xs body-4-semi-bold',
          24: 'size-24 rounded-sm body-4-semi-bold',
          32: 'size-32 rounded-sm body-3-semi-bold',
          40: 'size-40 rounded-md body-3-semi-bold',
          48: 'size-48 rounded-md body-2-semi-bold',
          56: 'size-56 rounded-lg heading-4-semi-bold',
          64: 'size-64 rounded-lg heading-3-semi-bold',
          72: 'size-72 rounded-lg heading-3-semi-bold',
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
 * Without `renderItem`, `data` must be `MediaImage` props: this is not enforced
 * by the types, and any other shape renders empty placeholders.
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
    () => sliceGroupItems(data, maxVisible),
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
        {visibleItems.map((item, index) => {
          const { id, ...imageProps } = item as MediaImageGroupItem;

          return (
            <div
              key={id ?? index}
              className={cn(mediaImageGroupVariants.slot({ size, shape }))}
            >
              {renderItem ? (
                renderItem(item, { size, shape })
              ) : (
                <MediaImage {...imageProps} size={size} shape={shape} />
              )}
            </div>
          );
        })}
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
