import {
  createSafeContext,
  DisabledProvider,
  useDisabledContext,
} from '@ledgerhq/lumen-utils-shared';
import { ElementRef, ReactNode, Ref } from 'react';
import { StyleSheet, View } from 'react-native';
import { useStyleSheet } from '../../../styles';
import { Box, Pressable, Text } from '../Utility';
import {
  ListItemContentProps,
  ListItemContentRowProps,
  ListItemDescriptionProps,
  ListItemLeadingProps,
  ListItemProps,
  ListItemTitleProps,
  ListItemTrailingProps,
} from './types';

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
 *   ListItemContent,
 *   ListItemTitle,
 *   ListItemDescription,
 *   ListItemTrailing,
 *   Spot,
 * } from '@ledgerhq/lumen-ui-rnative';
 * import { Wallet, ChevronRight } from '@ledgerhq/lumen-ui-rnative/symbols';
 *
 * <ListItem onPress={() => console.log('Clicked!')}>
 *   <ListItemLeading>
 *     <Spot size={48} appearance="icon" icon={Wallet} />
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
  disabled: disabledProp = false,
  ref,
  ...pressableProps
}: ListItemProps) => {
  const disabled = useDisabledContext({
    consumerName: 'ListItem',
    mergeWith: { disabled: disabledProp },
  });

  return (
    <DisabledProvider value={{ disabled }}>
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
    </DisabledProvider>
  );
};

/**
 * Internal component to handle pressed state styling
 */
const ListItemInner = ({
  pressed,
  children,
}: {
  pressed: boolean;
  children: ReactNode;
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
 * Contains the visual element (Spot, Avatar, Icon) and the content (title + description).
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
        gap: t.spacings.s4,
        alignItems: isInTrailing ? 'flex-end' : 'stretch',
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

/**
 * Horizontal row container within ListItemContent to place a title or description
 * alongside additional inline content (e.g. Tag) while preserving text truncation.
 */
export const ListItemContentRow = ({
  children,
  lx = {},
  style,
  ref,
  ...viewProps
}: ListItemContentRowProps & { ref?: Ref<View> }) => {
  const styles = useStyleSheet(
    (t) => ({
      row: {
        flexDirection: 'row',
        alignItems: 'center',
        minWidth: 0,
        gap: t.spacings.s8,
      },
    }),
    [],
  );

  return (
    <Box
      ref={ref}
      lx={lx}
      style={StyleSheet.flatten([styles.row, style])}
      {...viewProps}
    >
      {children}
    </Box>
  );
};

/**
 * The main title of the list item.
 */
export const ListItemTitle = ({
  children,
  lx = {},
  style,
  ref,
  ...textProps
}: ListItemTitleProps & { ref?: Ref<ElementRef<typeof Text>> }) => {
  const disabled = useDisabledContext({
    consumerName: 'ListItemTitle',
    contextRequired: true,
  });
  const { isInTrailing } = useListItemTrailingContext({
    consumerName: 'ListItemTitle',
    contextRequired: false,
  });

  const styles = useStyleSheet(
    (t) => ({
      title: StyleSheet.flatten([
        t.typographies.body2SemiBold,
        {
          minWidth: 0,
          flexShrink: 1,
          textAlign: isInTrailing ? 'right' : 'left',
          color: disabled ? t.colors.text.disabled : t.colors.text.base,
          ...(!isInTrailing && { flex: 1 }),
        } as const,
      ]),
    }),
    [disabled, isInTrailing],
  );

  return (
    <Text
      ref={ref}
      lx={lx}
      style={StyleSheet.flatten([styles.title, style])}
      numberOfLines={1}
      ellipsizeMode='tail'
      allowFontScaling={false}
      {...textProps}
    >
      {children}
    </Text>
  );
};

/**
 * Optional description text below the title.
 * Automatically applies disabled styling when the parent ListItem is disabled.
 */
export const ListItemDescription = ({
  children,
  lx = {},
  style,
  ref,
  ...textProps
}: ListItemDescriptionProps & { ref?: Ref<ElementRef<typeof Text>> }) => {
  const disabled = useDisabledContext({
    consumerName: 'ListItemDescription',
    contextRequired: true,
  });
  const { isInTrailing } = useListItemTrailingContext({
    consumerName: 'ListItemDescription',
    contextRequired: false,
  });

  const styles = useStyleSheet(
    (t) => ({
      description: StyleSheet.flatten([
        t.typographies.body3,
        {
          minWidth: 0,
          flexShrink: 1,
          textAlign: isInTrailing ? 'right' : 'left',
          color: disabled ? t.colors.text.disabled : t.colors.text.muted,
          ...(!isInTrailing && { flex: 1 }),
        } as const,
      ]),
    }),
    [disabled, isInTrailing],
  );

  return (
    <Text
      ref={ref}
      lx={lx}
      style={StyleSheet.flatten([styles.description, style])}
      numberOfLines={1}
      ellipsizeMode='tail'
      allowFontScaling={false}
      {...textProps}
    >
      {children}
    </Text>
  );
};

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
