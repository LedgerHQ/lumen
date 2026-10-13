import {
  DEFAULT_GROUP_MAX_VISIBLE,
  DisabledProvider,
  useDisabledContext,
  sliceGroupItems,
  formatGroupOverflowCount,
} from '@ledgerhq/lumen-utils-shared';
import { useMemo } from 'react';
import { StyleSheet } from 'react-native';
import { useStyleSheet } from '../../../../styles';
import type { LumenStyleSheetTheme } from '../../../../styles';
import { Box, Text } from '../../primitives';
import { MediaImage } from '../MediaImage';
import type { MediaImageSize, MediaImageShape } from '../MediaImage';
import { borderRadiusMap } from '../MediaImage/MediaImage';
import type { MediaImageGroupItem, MediaImageGroupProps } from './types';

type SpacingKey = keyof LumenStyleSheetTheme['spacings'];
type TypographyKey =
  | 'body4SemiBold'
  | 'body3SemiBold'
  | 'body2SemiBold'
  | 'heading4SemiBold'
  | 'heading3SemiBold';

// About 25% of the size, snapped to the spacing scale.
const overlapMap: Record<MediaImageSize, SpacingKey> = {
  12: 's4',
  16: 's4',
  20: 's6',
  24: 's6',
  32: 's8',
  40: 's10',
  48: 's12',
  56: 's14',
  64: 's16',
  72: 's16',
};

// The ring grows with the size, up to 2px.
const ringMap: Record<MediaImageSize, SpacingKey> = {
  12: 's1',
  16: 's1',
  20: 's1',
  24: 's1',
  32: 's1',
  40: 's2',
  48: 's2',
  56: 's2',
  64: 's2',
  72: 's2',
};

const overflowTypographyMap: Record<MediaImageSize, TypographyKey> = {
  12: 'body4SemiBold',
  16: 'body4SemiBold',
  20: 'body4SemiBold',
  24: 'body4SemiBold',
  32: 'body3SemiBold',
  40: 'body3SemiBold',
  48: 'body2SemiBold',
  56: 'heading4SemiBold',
  64: 'heading3SemiBold',
  72: 'heading3SemiBold',
};

const useStyles = ({
  size,
  shape,
  disabled = false,
}: {
  size: MediaImageSize;
  shape: MediaImageShape;
  disabled?: boolean;
}) => {
  return useStyleSheet(
    (t) => {
      const sizeValue = t.sizes[`s${size}` as keyof typeof t.sizes] as number;
      const radius =
        shape === 'circle'
          ? t.borderRadius.full
          : t.borderRadius[borderRadiusMap[size]];

      return {
        root: {
          flexDirection: 'row',
          alignItems: 'center',
        },
        slot: {
          padding: t.spacings[ringMap[size]],
          borderRadius: radius,
          overflow: 'hidden',
          backgroundColor: t.colors.bg.base,
        },
        slotOverlap: {
          marginLeft: -t.spacings[overlapMap[size]],
        },
        overflow: {
          width: sizeValue,
          height: sizeValue,
          borderRadius: radius,
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: t.colors.bg.interactive,
          ...(disabled && { opacity: 0.3 }),
        },
        overflowText: {
          ...t.typographies[overflowTypographyMap[size]],
          color: t.colors.text.onInteractive,
        },
      };
    },
    [size, shape, disabled],
  );
};

type OverflowBadgeProps = {
  count: number;
  size: MediaImageSize;
  shape: MediaImageShape;
  overlap: boolean;
  testID?: string;
  label?: string;
};

const OverflowBadge = ({
  count,
  size,
  shape,
  overlap,
  testID,
  label,
}: OverflowBadgeProps) => {
  const disabled = useDisabledContext({ consumerName: 'MediaImageGroup' });
  const styles = useStyles({ size, shape, disabled });

  return (
    <Box
      style={StyleSheet.flatten([styles.slot, overlap && styles.slotOverlap])}
    >
      <Box
        style={styles.overflow}
        testID={testID}
        accessible={!!label}
        accessibilityLabel={label}
      >
        <Text style={styles.overflowText} allowFontScaling={false}>
          {formatGroupOverflowCount(count)}
        </Text>
      </Box>
    </Box>
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
 * import { MediaImageGroup } from '@ledgerhq/lumen-ui-rnative';
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
  data,
  renderItem,
  size = 32,
  shape = 'circle',
  maxVisible = DEFAULT_GROUP_MAX_VISIBLE,
  disabled: disabledProp = false,
  overflowTestID,
  overflowLabel,
  lx = {},
  style,
  ref,
  ...props
}: MediaImageGroupProps<T>) {
  const disabled = useDisabledContext({
    consumerName: 'MediaImageGroup',
    mergeWith: { disabled: disabledProp },
  });
  const styles = useStyles({ size, shape });

  const { visibleItems, overflowCount } = useMemo(
    () => sliceGroupItems(data, maxVisible),
    [data, maxVisible],
  );

  if (data.length === 0) {
    return null;
  }

  return (
    <Box
      ref={ref}
      lx={lx}
      style={StyleSheet.flatten([styles.root, style])}
      {...props}
    >
      <DisabledProvider value={{ disabled }}>
        {visibleItems.map((item, index) => {
          const { id, ...imageProps } = item as MediaImageGroupItem;

          return (
            <Box
              key={id ?? index}
              style={StyleSheet.flatten([
                styles.slot,
                index > 0 && styles.slotOverlap,
              ])}
            >
              {renderItem ? (
                renderItem(item, { size, shape })
              ) : (
                <MediaImage {...imageProps} size={size} shape={shape} />
              )}
            </Box>
          );
        })}
        {overflowCount > 0 && (
          <OverflowBadge
            count={overflowCount}
            size={size}
            shape={shape}
            overlap={visibleItems.length > 0}
            testID={overflowTestID}
            label={overflowLabel}
          />
        )}
      </DisabledProvider>
    </Box>
  );
}
