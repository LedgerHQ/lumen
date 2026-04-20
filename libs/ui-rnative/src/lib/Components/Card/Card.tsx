import {
  createSafeContext,
  DisabledProvider,
  isTextChildren,
} from '@ledgerhq/lumen-utils-shared';
import type { ReactNode, Ref } from 'react';
import { useCallback, useEffect, useMemo } from 'react';
import type { LayoutChangeEvent, ViewStyle } from 'react-native';
import { StyleSheet, View } from 'react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';
import { useStyleSheet } from '../../../styles';
import { useTimingConfig } from '../../Animations/useTimingConfig';
import { ChevronDown, ChevronUp } from '../../Symbols';
import { Box, Text, Pressable } from '../Utility';

import type {
  CardContentAlignContextValue,
  CardContentDescriptionProps,
  CardContentProps,
  CardContentRowProps,
  CardContentTitleProps,
  CardContextValue,
  CardFooterActionsProps,
  CardFooterProps,
  CardHeaderProps,
  CardLeadingProps,
  CardProps,
  CardTrailingProps,
  CardType,
} from './types';

const resolveCardInnerContext = ({
  type,
  expanded,
  onPress,
  disabled,
}: {
  type: CardType;
  expanded: CardProps['expanded'];
  onPress: CardProps['onPress'];
  disabled: CardProps['disabled'];
}): CardContextValue => {
  switch (type) {
    case 'interactive':
      return {
        cardPressable: !!onPress,
        headerPressable: false,
        footerExpanded: true,
        disabled: !!disabled,
        onHeaderPress: undefined,
      };
    case 'expandable':
      return {
        cardPressable: false,
        headerPressable: !!onPress && !disabled,
        footerExpanded: Boolean(expanded),
        disabled: !!disabled,
        onHeaderPress: onPress,
      };
    case 'info':
      return {
        cardPressable: false,
        headerPressable: false,
        footerExpanded: true,
        disabled: !!disabled,
        onHeaderPress: undefined,
      };
  }
};

const [CardProvider, useCardContext] = createSafeContext<CardContextValue>(
  'Card',
  {
    cardPressable: false,
    headerPressable: false,
    footerExpanded: true,
    disabled: false,
  },
);

const [CardContentAlignProvider, useCardContentAlignContext] =
  createSafeContext<CardContentAlignContextValue>('CardContentAlign', {
    align: 'left',
  });

const useCardStyles = ({
  outlined,
  pressed,
  disabled,
  interactive,
}: {
  outlined: boolean;
  pressed: boolean;
  disabled: boolean;
  interactive: boolean;
}) => {
  return useStyleSheet(
    (t) => ({
      container: StyleSheet.flatten([
        {
          flexDirection: 'column',
          width: t.sizes.full,
          overflow: 'hidden',
          borderRadius: t.borderRadius.lg,
          backgroundColor: t.colors.bg.surface,
        },
        outlined && {
          borderWidth: t.borderWidth.s2,
          borderColor: t.colors.border.active,
        },
        interactive &&
          pressed &&
          !disabled && {
            backgroundColor: t.colors.bg.surfacePressed,
          },
      ]),
    }),
    [outlined, pressed, disabled, interactive],
  );
};

/**
 * A flexible card component that uses a composite pattern for maximum customization.
 *
 * - `type="interactive"` (default): whole card is pressable with pressed states.
 * - `type="expandable"`: only CardHeader is pressable, toggles footer visibility.
 * - `type="info"`: data-display only, no built-in press handling.
 *
 * @see {@link https://ldls.vercel.app/?path=/docs/react-native_containment-card--docs Storybook}
 *
 * @warning The `lx` prop should only be used for layout adjustments like margins or positioning.
 * Do not use it to modify the card's core appearance (colors, padding, etc).
 *
 * @example
 * <Card onPress={handlePress}>
 *   <CardHeader>
 *     <CardLeading>
 *       <CryptoIcon ledgerId="bitcoin" ticker="BTC" size={40} />
 *       <CardContent>
 *         <CardContentTitle>Bitcoin</CardContentTitle>
 *         <CardContentDescription>BTC</CardContentDescription>
 *       </CardContent>
 *     </CardLeading>
 *   </CardHeader>
 * </Card>
 */
export const Card = ({
  ref,
  lx = {},
  style,
  type = 'interactive',
  expanded,
  outlined = false,
  disabled = false,
  onPress,
  children,
  ...props
}: CardProps) => {
  const innerContext = useMemo(
    () => resolveCardInnerContext({ type, expanded, onPress, disabled }),
    [type, expanded, onPress, disabled],
  );

  if (innerContext.cardPressable) {
    return (
      <CardProvider value={innerContext}>
        <DisabledProvider value={{ disabled }}>
          <Pressable
            ref={ref}
            lx={lx}
            style={style as ViewStyle}
            onPress={onPress}
            disabled={disabled}
            accessibilityRole='button'
            accessibilityState={{ disabled }}
            {...props}
          >
            {({ pressed }) => (
              <CardInner
                outlined={outlined}
                pressed={pressed}
                disabled={disabled}
                interactive
              >
                {children}
              </CardInner>
            )}
          </Pressable>
        </DisabledProvider>
      </CardProvider>
    );
  }

  return (
    <CardProvider value={innerContext}>
      <DisabledProvider value={{ disabled }}>
        <Box lx={lx} style={style} {...props}>
          <CardInner
            outlined={outlined}
            pressed={false}
            disabled={disabled}
            interactive={false}
          >
            {children}
          </CardInner>
        </Box>
      </DisabledProvider>
    </CardProvider>
  );
};

const CardInner = ({
  outlined,
  pressed,
  disabled,
  interactive,
  children,
}: {
  outlined: boolean;
  pressed: boolean;
  disabled: boolean;
  interactive: boolean;
  children: ReactNode;
}) => {
  const styles = useCardStyles({ outlined, pressed, disabled, interactive });
  return <View style={styles.container}>{children}</View>;
};

const useHeaderStyles = ({ pressed }: { pressed: boolean }) => {
  return useStyleSheet(
    (t) => ({
      container: StyleSheet.flatten([
        {
          flexDirection: 'row',
          alignItems: 'center',
          gap: t.spacings.s12,
          padding: t.spacings.s12,
        },
        pressed && {
          backgroundColor: t.colors.bg.surfacePressed,
        },
      ]),
    }),
    [pressed],
  );
};

/**
 * Header row container for the card. Lays out CardLeading and CardTrailing horizontally.
 * When the card `type` is `"expandable"`, the header becomes the press target.
 */
export const CardHeader = ({
  ref,
  children,
  lx = {},
  style,
  ...props
}: CardHeaderProps) => {
  const { disabled, headerPressable, footerExpanded, onHeaderPress } =
    useCardContext({
      consumerName: 'CardHeader',
      contextRequired: false,
    });

  const chevronStyle = useStyleSheet(
    (t) => ({
      icon: { color: t.colors.text.muted },
    }),
    [],
  );

  if (headerPressable && onHeaderPress) {
    return (
      <Pressable
        ref={ref}
        lx={lx}
        style={style as ViewStyle}
        onPress={onHeaderPress}
        disabled={disabled}
        accessibilityRole='button'
        accessibilityState={{ disabled, expanded: footerExpanded }}
        {...props}
      >
        {({ pressed }) => (
          <CardHeaderInner pressed={pressed}>
            {children}
            {footerExpanded ? (
              <ChevronUp size={20} style={chevronStyle.icon} />
            ) : (
              <ChevronDown size={20} style={chevronStyle.icon} />
            )}
          </CardHeaderInner>
        )}
      </Pressable>
    );
  }

  return (
    <Box ref={ref} lx={lx} style={style} {...props}>
      <CardHeaderInner pressed={false}>{children}</CardHeaderInner>
    </Box>
  );
};

const CardHeaderInner = ({
  pressed,
  children,
}: {
  pressed: boolean;
  children: ReactNode;
}) => {
  const styles = useHeaderStyles({ pressed });
  return <View style={styles.container}>{children}</View>;
};

/**
 * Leading section container. Wraps icon + CardContent.
 * Reusable inside both CardHeader and CardFooter.
 */
export const CardLeading = ({
  ref,
  children,
  lx = {},
  style,
  ...props
}: CardLeadingProps & { ref?: Ref<View> }) => {
  const styles = useStyleSheet(
    (t) => ({
      container: {
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
      style={StyleSheet.flatten([styles.container, style])}
      {...props}
    >
      {children}
    </Box>
  );
};

/**
 * Flex column wrapper for CardContentTitle and CardContentDescription.
 * Supports right alignment via context when used inside CardTrailing.
 */
export const CardContent = ({
  ref,
  children,
  lx = {},
  style,
  ...props
}: CardContentProps & { ref?: Ref<View> }) => {
  const { align } = useCardContentAlignContext({
    consumerName: 'CardContent',
    contextRequired: false,
  });

  const isTrailing = align === 'right';

  const styles = useStyleSheet(
    (t) => ({
      container: StyleSheet.flatten([
        {
          flexDirection: 'column',
          gap: t.spacings.s4,
        },
        isTrailing
          ? { flexShrink: 1, minWidth: 0, alignItems: 'flex-end' }
          : { flex: 1, minWidth: 0 },
      ]),
    }),
    [isTrailing],
  );

  return (
    <Box
      ref={ref}
      lx={lx}
      style={StyleSheet.flatten([styles.container, style])}
      {...props}
    >
      {children}
    </Box>
  );
};

/**
 * Horizontal row wrapper for placing a CardContentTitle or CardContentDescription
 * alongside additional inline content (e.g. Tag) while preserving text truncation.
 */
export const CardContentRow = ({
  ref,
  children,
  lx = {},
  style,
  ...props
}: CardContentRowProps & { ref?: Ref<View> }) => {
  const { align } = useCardContentAlignContext({
    consumerName: 'CardContentRow',
    contextRequired: false,
  });

  const styles = useStyleSheet(
    (t) => ({
      container: StyleSheet.flatten([
        {
          flexDirection: 'row',
          minWidth: 0,
          alignItems: 'center',
          gap: t.spacings.s8,
        },
        align === 'right' && {
          justifyContent: 'flex-end',
        },
      ]),
    }),
    [align],
  );

  return (
    <Box
      ref={ref}
      lx={lx}
      style={StyleSheet.flatten([styles.container, style])}
      {...props}
    >
      {children}
    </Box>
  );
};

/**
 * Primary text of the card. Inherits the disabled state from the parent Card via context.
 */
export const CardContentTitle = ({
  ref,
  children,
  lx = {},
  style,
  ...props
}: CardContentTitleProps & { ref?: Ref<View> }) => {
  const { disabled } = useCardContext({
    consumerName: 'CardContentTitle',
    contextRequired: false,
  });
  const { align } = useCardContentAlignContext({
    consumerName: 'CardContentTitle',
    contextRequired: false,
  });

  const styles = useStyleSheet(
    (t) => ({
      asBox: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: t.spacings.s4,
        width: '100%',
        justifyContent: align === 'right' ? 'flex-end' : 'flex-start',
      },
      asText: StyleSheet.flatten([
        t.typographies.body2SemiBold,
        {
          flexShrink: 1,
          color: disabled ? t.colors.text.disabled : t.colors.text.base,
          textAlign: align === 'right' ? 'right' : 'left',
        },
      ]),
    }),
    [disabled, align],
  );

  if (isTextChildren(children)) {
    return (
      <Text
        ref={ref as Ref<React.ElementRef<typeof Text>>}
        lx={lx}
        style={StyleSheet.flatten([styles.asText, style])}
        numberOfLines={1}
        ellipsizeMode='tail'
        {...props}
      >
        {children}
      </Text>
    );
  }

  return (
    <Box
      ref={ref}
      lx={lx}
      style={StyleSheet.flatten([styles.asBox, style])}
      {...props}
    >
      {children}
    </Box>
  );
};

/**
 * Secondary text of the card. Inherits the disabled state from the parent Card via context.
 */
export const CardContentDescription = ({
  ref,
  children,
  lx = {},
  style,
  ...props
}: CardContentDescriptionProps & { ref?: Ref<View> }) => {
  const { disabled } = useCardContext({
    consumerName: 'CardContentDescription',
    contextRequired: false,
  });
  const { align } = useCardContentAlignContext({
    consumerName: 'CardContentDescription',
    contextRequired: false,
  });

  const styles = useStyleSheet(
    (t) => ({
      asBox: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: t.spacings.s4,
        width: '100%',
        justifyContent: align === 'right' ? 'flex-end' : 'flex-start',
      },
      asText: StyleSheet.flatten([
        t.typographies.body3,
        {
          flexShrink: 1,
          color: disabled ? t.colors.text.disabled : t.colors.text.muted,
          textAlign: align === 'right' ? 'right' : 'left',
        },
      ]),
    }),
    [disabled, align],
  );

  if (isTextChildren(children)) {
    return (
      <Text
        ref={ref as Ref<React.ElementRef<typeof Text>>}
        lx={lx}
        style={StyleSheet.flatten([styles.asText, style])}
        numberOfLines={1}
        ellipsizeMode='tail'
        {...props}
      >
        {children}
      </Text>
    );
  }

  return (
    <Box
      ref={ref}
      lx={lx}
      style={StyleSheet.flatten([styles.asBox, style])}
      {...props}
    >
      {children}
    </Box>
  );
};

/**
 * Trailing content container in the header. Used for Button, Tag, or right-aligned CardContent.
 * Inherits the disabled state from the parent Card via context.
 */
export const CardTrailing = ({
  ref,
  children,
  lx = {},
  style,
  ...props
}: CardTrailingProps & { ref?: Ref<View> }) => {
  const styles = useStyleSheet(
    (t) => ({
      container: {
        gap: t.spacings.s12,
        flexDirection: 'row',
        alignItems: 'center',
      },
    }),
    [],
  );

  return (
    <CardContentAlignProvider value={{ align: 'right' }}>
      <Box
        ref={ref}
        lx={lx}
        style={StyleSheet.flatten([styles.container, style])}
        {...props}
      >
        {children}
      </Box>
    </CardContentAlignProvider>
  );
};

const useCardFooterAnimation = ({
  footerExpanded,
}: {
  footerExpanded?: boolean;
}) => {
  const contentHeight = useSharedValue(0);
  const animatedHeight = useSharedValue(footerExpanded ? 1 : 0);

  const onContentLayout = useCallback(
    (event: LayoutChangeEvent) => {
      const height = event.nativeEvent.layout.height;
      if (height > 0) {
        contentHeight.value = height;
      }
    },
    [contentHeight],
  );

  const timingConfig = useTimingConfig({
    duration: 300,
    easing: 'easeInOut',
  });

  useEffect(() => {
    animatedHeight.value = withTiming(footerExpanded ? 1 : 0, timingConfig);
  }, [timingConfig, footerExpanded, animatedHeight]);

  const animatedContainerStyle = useAnimatedStyle(
    () => ({
      height:
        contentHeight.value > 0
          ? animatedHeight.value * contentHeight.value
          : undefined,
      overflow: 'hidden',
    }),
    [contentHeight, animatedHeight],
  );

  return { onContentLayout, animatedContainerStyle };
};

/**
 * Footer container for the card. Collapses with a 300ms animation
 * when `footerExpanded` is `false` (only happens in `"expandable"` mode).
 */
export const CardFooter = ({
  ref,
  children,
  lx = {},
  style,
  ...props
}: CardFooterProps & { ref?: Ref<View> }) => {
  const { disabled, footerExpanded } = useCardContext({
    consumerName: 'CardFooter',
    contextRequired: false,
  });

  const { onContentLayout, animatedContainerStyle } = useCardFooterAnimation({
    footerExpanded,
  });

  const footerStyles = useStyleSheet(
    (t) => ({
      wrapper: {
        backgroundColor: t.colors.bg.mutedTransparent,
      },
      content: StyleSheet.flatten([
        {
          width: t.sizes.full,
          flexDirection: 'column',
          gap: t.spacings.s8,
          paddingHorizontal: t.spacings.s12,
          paddingVertical: t.spacings.s10,
        },
        disabled && {
          opacity: 0.5,
        },
      ]),
    }),
    [disabled],
  );

  return (
    <Animated.View style={[footerStyles.wrapper, animatedContainerStyle]}>
      <View onLayout={onContentLayout}>
        <Box ref={ref} lx={lx} style={[footerStyles.content, style]} {...props}>
          {children}
        </Box>
      </View>
    </Animated.View>
  );
};

/**
 * Horizontal row container for action buttons inside CardFooter.
 */
export const CardFooterActions = ({
  ref,
  children,
  lx = {},
  style,
  ...props
}: CardFooterActionsProps & { ref?: Ref<View> }) => {
  const styles = useStyleSheet(
    (t) => ({
      container: {
        flexDirection: 'row',
        justifyContent: 'flex-end',
        gap: t.spacings.s10,
      },
    }),
    [],
  );

  return (
    <Box
      ref={ref}
      lx={lx}
      style={StyleSheet.flatten([styles.container, style])}
      {...props}
    >
      {children}
    </Box>
  );
};
