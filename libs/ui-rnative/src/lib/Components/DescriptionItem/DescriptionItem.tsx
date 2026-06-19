import { createSafeContext } from '@ledgerhq/lumen-utils-shared';
import { StyleSheet } from 'react-native';
import { useStyleSheet } from '../../../styles';
import { Box, Text } from '../Utility';
import type {
  DescriptionItemLabelProps,
  DescriptionItemLeadingProps,
  DescriptionItemProps,
  DescriptionItemSize,
  DescriptionItemTrailingProps,
  DescriptionItemValueProps,
} from './types';

type DescriptionItemSizeContextValue = {
  size: DescriptionItemSize;
};

const [DescriptionItemSizeProvider, useDescriptionItemSizeContext] =
  createSafeContext<DescriptionItemSizeContextValue>('DescriptionItemSize', {
    size: 'md',
  });

/**
 * A compound component for displaying a key-value description row.
 * Composed with DescriptionItemLeading / DescriptionItemLabel (key side)
 * and DescriptionItemTrailing / DescriptionItemValue (value side).
 *
 * @see {@link https://ldls-react-native.vercel.app/?path=/docs/core-descriptionitem--docs Storybook}
 *
 * @example
 * <DescriptionItem size="md">
 *   <DescriptionItemLeading>
 *     <DescriptionItemLabel>Fees</DescriptionItemLabel>
 *   </DescriptionItemLeading>
 *   <DescriptionItemTrailing>
 *     <DescriptionItemValue>0.001 BTC</DescriptionItemValue>
 *   </DescriptionItemTrailing>
 * </DescriptionItem>
 */
export const DescriptionItem = ({
  children,
  lx = {},
  style,
  size = 'md',
  ...props
}: DescriptionItemProps) => {
  const styles = useStyleSheet(
    (t) => ({
      root: {
        width: '100%',
        flexDirection: 'row',
        alignItems: 'flex-start',
        gap: t.spacings.s12,
      },
    }),
    [],
  );

  return (
    <DescriptionItemSizeProvider value={{ size }}>
      <Box lx={lx} style={StyleSheet.flatten([styles.root, style])} {...props}>
        {children}
      </Box>
    </DescriptionItemSizeProvider>
  );
};

/**
 * Layout container for the leading (left) side of the description item.
 * Contains DescriptionItemLabel and an optional info icon sibling.
 */
export const DescriptionItemLeading = ({
  children,
  lx = {},
  style,
  ...props
}: DescriptionItemLeadingProps) => {
  const styles = useStyleSheet(
    (t) => ({
      leading: {
        flex: 1,
        minWidth: 0,
        flexDirection: 'row',
        alignItems: 'center',
        gap: t.spacings.s4,
      },
    }),
    [],
  );

  return (
    <Box lx={lx} style={StyleSheet.flatten([styles.leading, style])} {...props}>
      {children}
    </Box>
  );
};

/**
 * Typography-bearing label for the leading side.
 * Reads size from DescriptionItemSizeContext to apply the correct typography
 * based on the size of the parent `DescriptionItem`.
 */
export const DescriptionItemLabel = ({
  children,
  lx = {},
  style,
  numberOfLines = 2,
  ellipsizeMode = 'tail',
  ...props
}: DescriptionItemLabelProps) => {
  const { size } = useDescriptionItemSizeContext({
    consumerName: 'DescriptionItemLabel',
    contextRequired: false,
  });

  const styles = useStyleSheet(
    (t) => ({
      label: StyleSheet.flatten([
        size === 'md' ? t.typographies.body2 : t.typographies.body3,
        {
          flexShrink: 1,
          minWidth: 0,
          color: t.colors.text.muted,
        },
      ]),
    }),
    [size],
  );

  return (
    <Text
      lx={lx}
      style={StyleSheet.flatten([styles.label, style])}
      numberOfLines={numberOfLines}
      ellipsizeMode={ellipsizeMode}
      allowFontScaling={false}
      {...props}
    >
      {children}
    </Text>
  );
};

/**
 * Layout container for the trailing (right) side of the description item.
 * Accepts DescriptionItemValue, Tag, Link, or any custom content.
 */
export const DescriptionItemTrailing = ({
  children,
  lx = {},
  style,
  ...props
}: DescriptionItemTrailingProps) => {
  const styles = useStyleSheet(
    (t) => ({
      trailing: {
        flexShrink: 0,
        maxWidth: '80%',
        flexDirection: 'row',
        alignItems: 'center',
        gap: t.spacings.s4,
      },
    }),
    [],
  );

  return (
    <Box
      lx={lx}
      style={StyleSheet.flatten([styles.trailing, style])}
      {...props}
    >
      {children}
    </Box>
  );
};

/**
 * Typography-bearing value for the trailing side.
 * Reads size from DescriptionItemSizeContext to apply the correct typography
 * based on the size of the parent `DescriptionItem`.
 */
export const DescriptionItemValue = ({
  children,
  lx = {},
  style,
  numberOfLines = 1,
  ellipsizeMode = 'tail',
  ...props
}: DescriptionItemValueProps) => {
  const { size } = useDescriptionItemSizeContext({
    consumerName: 'DescriptionItemValue',
    contextRequired: false,
  });

  const styles = useStyleSheet(
    (t) => ({
      value: StyleSheet.flatten([
        size === 'md'
          ? t.typographies.body2SemiBold
          : t.typographies.body3SemiBold,
        {
          flexShrink: 1,
          minWidth: 0,
          color: t.colors.text.base,
        },
      ]),
    }),
    [size],
  );

  return (
    <Text
      lx={lx}
      style={StyleSheet.flatten([styles.value, style])}
      numberOfLines={numberOfLines}
      ellipsizeMode={ellipsizeMode}
      allowFontScaling={false}
      {...props}
    >
      {children}
    </Text>
  );
};
