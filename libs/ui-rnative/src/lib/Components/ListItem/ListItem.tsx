import {
  createSafeContext,
  isTextChildren,
} from '@ledgerhq/lumen-utils-shared';
import React, { Ref } from 'react';
import { StyleSheet, View } from 'react-native';
import { useStyleSheet, useTheme } from '../../../styles';
import { Spot } from '../Spot';
import { Box, Pressable, Text } from '../Utility';
import {
  ListItemContentProps,
  ListItemContextValue,
  ListItemDescriptionProps,
  ListItemIconProps,
  ListItemLeadingProps,
  ListItemProps,
  ListItemSpotProps,
  ListItemTitleProps,
  ListItemTrailingProps,
  ListItemTruncateProps,
} from './types';

const [ListItemProvider, useListItemContext] =
  createSafeContext<ListItemContextValue>('ListItem', {});

const [ListItemTrailingProvider, useListItemTrailingContext] =
  createSafeContext<{ isInTrailing: boolean }>('ListItemTrailing', {
    isInTrailing: false,
  });

const useRootStyles = ({ pressed }: { pressed: boolean }) => {
  return useStyleSheet(
    (t) => ({
      container: StyleSheet.flatten([
        {
          flexDirection: 'row',
          alignItems: 'center',
          height: t.sizes.s64,
          width: t.sizes.full,
          gap: t.spacings.s16,
          borderRadius: t.borderRadius.md,
          backgroundColor: 'transparent',
          paddingHorizontal: t.spacings.s8,
          paddingVertical: t.spacings.s12,
        },
        pressed && {
          backgroundColor: t.colors.bg.baseTransparentPressed,
        },
      ]),
    }),
    [pressed],
  );
};

/**
 * A flexible list item component that provides a composable structure for displaying
 * interactive list items with leading content, title, description, and trailing content.
 *
 * @see {@link https://ldls.vercel.app/?path=/docs/react-native_containment-listitem--docs Storybook}
 * @see {@link https://ldls.vercel.app/?path=/docs/react-native_containment-listitem--docs#dos-and-donts Guidelines}
 *
 * @warning The `lx` prop should only be used for layout adjustments like margins or positioning.
 * Do not use it to modify the list item's core appearance (colors, padding, etc).
 *
 * @example
 * import {
 *   ListItem,
 *   ListItemLeading,
 *   ListItemSpot,
 *   ListItemContent,
 *   ListItemTitle,
 *   ListItemDescription,
 *   ListItemTrailing,
 * } from '@ledgerhq/lumen-ui-rnative';
 * import { Wallet, ChevronRight } from '@ledgerhq/lumen-ui-rnative/symbols';
 *
 * <ListItem onPress={() => console.log('Clicked!')}>
 *   <ListItemLeading>
 *     <ListItemSpot appearance="icon" icon={Wallet} />
 *     <ListItemContent>
 *       <ListItemTitle>Balance</ListItemTitle>
 *       <ListItemDescription>Optional description</ListItemDescription>
 *     </ListItemContent>
 *   </ListItemLeading>
 *   <ListItemTrailing>
 *     <ChevronRight size={24} />
 *   </ListItemTrailing>
 * </ListItem>
 */
export const ListItem = ({
  children,
  lx = {},
  style,
  disabled = false,
  ref,
  ...pressableProps
}: ListItemProps) => {
  return (
    <ListItemProvider value={{ disabled }}>
      <Pressable
        ref={ref}
        lx={lx}
        style={style}
        disabled={disabled}
        accessibilityRole='button'
        accessibilityState={{ disabled }}
        {...pressableProps}
      >
        {({ pressed }) => (
          <ListItemInner pressed={pressed}>{children}</ListItemInner>
        )}
      </Pressable>
    </ListItemProvider>
  );
};

ListItem.displayName = 'ListItem';

/**
 * Internal component to handle pressed state styling
 */
const ListItemInner = ({
  pressed,
  children,
}: {
  pressed: boolean;
  children: React.ReactNode;
}) => {
  const styles = useRootStyles({ pressed });
  return (
    <View style={styles.container} testID='list-item-content'>
      {children}
    </View>
  );
};

/**
 * Container for the leading (left) part of the list item.
 * Contains the visual element (ListItemSpot, Avatar, Icon) and the content (title + description).
 */
export const ListItemLeading = ({
  children,
  lx = {},
  style,
  ref,
  ...viewProps
}: ListItemLeadingProps & { ref?: Ref<View> }) => {
  const styles = useStyleSheet(
    (t) => ({
      leading: {
        flex: 1,
        minWidth: 0,
        flexDirection: 'row',
        alignItems: 'center',
        gap: t.spacings.s12,
      },
    }),
    [],
  );

  return (
    <Box
      ref={ref}
      lx={lx}
      style={StyleSheet.flatten([styles.leading, style])}
      {...viewProps}
    >
      {children}
    </Box>
  );
};

ListItemLeading.displayName = 'ListItemLeading';

/**
 * Container for the text content (title and description) within the leading area.
 */
export const ListItemContent = ({
  children,
  lx = {},
  style,
  ref,
  ...viewProps
}: ListItemContentProps & { ref?: Ref<View> }) => {
  const { isInTrailing } = useListItemTrailingContext({
    consumerName: 'ListItemContent',
    contextRequired: false,
  });

  const styles = useStyleSheet(
    (t) => ({
      content: {
        flex: isInTrailing ? 0 : 1,
        minWidth: 0,
        flexDirection: 'column',
        gap: t.spacings.s4,
      },
    }),
    [isInTrailing],
  );

  return (
    <Box
      ref={ref}
      lx={lx}
      style={StyleSheet.flatten([styles.content, style])}
      {...viewProps}
    >
      {children}
    </Box>
  );
};

ListItemContent.displayName = 'ListItemContent';

/**
 * The main title of the list item. Can contain text directly or
 * ListItemTruncate + Tag for more complex layouts.
 */
export const ListItemTitle = ({
  children,
  lx = {},
  style,
  ref,
  ...viewProps
}: ListItemTitleProps & { ref?: Ref<View> }) => {
  const { disabled } = useListItemContext({
    consumerName: 'ListItemTitle',
    contextRequired: true,
  });
  const { isInTrailing } = useListItemTrailingContext({
    consumerName: 'ListItemTitle',
    contextRequired: false,
  });

  const styles = useStyleSheet(
    (t) => {
      const { boxStyle } = StyleSheet.create({
        boxStyle: {
          flexDirection: 'row',
          alignItems: 'center',
          gap: t.spacings.s4,
          width: '100%',
          textAlign: isInTrailing ? 'right' : 'left',
          justifyContent: isInTrailing ? 'flex-end' : 'flex-start',
        } as const,
      });

      return {
        asBox: boxStyle,
        asText: StyleSheet.flatten([
          t.typographies.body2SemiBold,
          {
            ...boxStyle,
            color: disabled ? t.colors.text.disabled : t.colors.text.base,
          },
        ]),
      };
    },
    [disabled],
  );

  // If children is a string, render it directly as Text with truncation
  if (isTextChildren(children)) {
    return (
      <Text
        ref={ref as Ref<React.ElementRef<typeof Text>>}
        lx={lx}
        style={StyleSheet.flatten([styles.asText, style])}
        numberOfLines={1}
        ellipsizeMode='tail'
      >
        {children}
      </Text>
    );
  }

  // Otherwise, render as a row container for ListItemTruncate + Tag
  return (
    <Box
      ref={ref}
      lx={lx}
      style={StyleSheet.flatten([styles.asBox, style])}
      {...viewProps}
    >
      {children}
    </Box>
  );
};

ListItemTitle.displayName = 'ListItemTitle';

/**
 * Optional description below the title. Can contain text directly or
 * ListItemTruncate + Tag for more complex layouts.
 * Automatically applies disabled styling when the parent ListItem is disabled.
 */
export const ListItemDescription = ({
  children,
  lx = {},
  style,
  ref,
  ...viewProps
}: ListItemDescriptionProps & { ref?: Ref<View> }) => {
  const { disabled } = useListItemContext({
    consumerName: 'ListItemDescription',
    contextRequired: true,
  });
  const { isInTrailing } = useListItemTrailingContext({
    consumerName: 'ListItemDescription',
    contextRequired: false,
  });

  const styles = useStyleSheet(
    (t) => {
      const { boxStyle } = StyleSheet.create({
        boxStyle: {
          flexDirection: 'row',
          alignItems: 'center',
          gap: t.spacings.s4,
          width: '100%',
          textAlign: isInTrailing ? 'right' : 'left',
          justifyContent: isInTrailing ? 'flex-end' : 'flex-start',
        } as const,
      });

      return {
        asBox: boxStyle,
        asText: StyleSheet.flatten([
          t.typographies.body3,
          {
            ...boxStyle,
            color: disabled ? t.colors.text.disabled : t.colors.text.muted,
          },
        ]),
      };
    },
    [disabled, isInTrailing],
  );

  // If children is a string, render it directly as Text with truncation
  if (isTextChildren(children)) {
    return (
      <Text
        ref={ref as Ref<React.ElementRef<typeof Text>>}
        lx={lx}
        style={StyleSheet.flatten([styles.asText, style])}
        numberOfLines={1}
        ellipsizeMode='tail'
      >
        {children}
      </Text>
    );
  }

  // Otherwise, render as a row container for ListItemTruncate + Tag
  return (
    <Box
      ref={ref}
      lx={lx}
      style={StyleSheet.flatten([styles.asBox, style])}
      {...viewProps}
    >
      {children}
    </Box>
  );
};

ListItemDescription.displayName = 'ListItemDescription';

/**
 * Container for the trailing (right) content of the list item.
 * Used for icons, switches, values, tags, chevrons, etc.
 */
export const ListItemTrailing = ({
  children,
  lx = {},
  style,
  ref,
  ...viewProps
}: ListItemTrailingProps & { ref?: Ref<View> }) => {
  const styles = useStyleSheet(
    () => ({
      trailing: {
        flexShrink: 0,
        flexDirection: 'row',
        alignItems: 'center',
      },
    }),
    [],
  );

  return (
    <ListItemTrailingProvider value={{ isInTrailing: true }}>
      <Box
        ref={ref}
        lx={lx}
        style={StyleSheet.flatten([styles.trailing, style])}
        {...viewProps}
      >
        {children}
      </Box>
    </ListItemTrailingProvider>
  );
};

ListItemTrailing.displayName = 'ListItemTrailing';

/**
 * Spot adapter for ListItem. Automatically inherits disabled state from parent ListItem.
 * Fixed at size 48 for consistent list item appearance.
 */
export const ListItemSpot = (props: ListItemSpotProps) => {
  const { disabled } = useListItemContext({
    consumerName: 'ListItemSpot',
    contextRequired: true,
  });

  return <Spot {...props} size={48} disabled={disabled} />;
};

ListItemSpot.displayName = 'ListItemSpot';

/**
 * Icon adapter for ListItem. Automatically inherits disabled state from parent ListItem.
 * Fixed at size 24 for consistent list item appearance.
 */
export const ListItemIcon = ({
  icon: Icon,
  color,
  lx = {},
  style,
  ...viewProps
}: ListItemIconProps) => {
  const { theme } = useTheme();
  const { disabled } = useListItemContext({
    consumerName: 'ListItemIcon',
    contextRequired: true,
  });

  return (
    <Box
      lx={lx}
      style={StyleSheet.flatten([{ flexShrink: 0 }, style])}
      {...viewProps}
    >
      <Icon
        size={24}
        style={{
          color: disabled
            ? theme.colors.text.disabled
            : (color ?? theme.colors.text.base),
        }}
      />
    </Box>
  );
};

ListItemIcon.displayName = 'ListItemIcon';

/**
 * Text wrapper that truncates when space is limited.
 * Use inside ListItemTitle or ListItemDescription when combining text with a Tag.
 * Set variant='title' for title styling or variant='description' (default) for description styling.
 */
export const ListItemTruncate = ({
  children,
  variant = 'description',
  lx = {},
  style,
  ref,
  ...textProps
}: ListItemTruncateProps & { ref?: Ref<React.ElementRef<typeof Text>> }) => {
  const { disabled } = useListItemContext({
    consumerName: 'ListItemTruncate',
    contextRequired: true,
  });

  const styles = useStyleSheet(
    (t) => ({
      truncate: StyleSheet.flatten([
        variant === 'title'
          ? t.typographies.body2SemiBold
          : t.typographies.body3,
        {
          color: disabled
            ? t.colors.text.disabled
            : variant === 'title'
              ? t.colors.text.base
              : t.colors.text.muted,
          minWidth: 0,
          flexShrink: 1,
        },
      ]),
    }),
    [disabled, variant],
  );

  return (
    <Text
      ref={ref}
      lx={lx}
      style={StyleSheet.flatten([styles.truncate, style])}
      numberOfLines={1}
      ellipsizeMode='tail'
      {...textProps}
    >
      {children}
    </Text>
  );
};

ListItemTruncate.displayName = 'ListItemTruncate';
