/**
 * InlinedCard
 *
 * A minimal, self-contained Card. Only depends on `react`, `react-native`
 * and `react-native-reanimated`. Design tokens are resolved to concrete light
 * theme values (ledger-live) so no theme provider is required.
 *
 * Mirrors the compound API of the real Card (Card, CardHeader, CardLeading,
 * CardContent, CardContentRow, CardContentTitle, CardContentDescription,
 * CardTrailing, CardFooter, CardFooterActions) but flattened into one file.
 */
import {
  createContext,
  isValidElement,
  useCallback,
  useContext,
  useMemo,
} from 'react';
import type { ReactNode } from 'react';
import type {
  GestureResponderEvent,
  LayoutChangeEvent,
  StyleProp,
  TextStyle,
  ViewStyle,
} from 'react-native';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import Animated, {
  Easing,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';

/* Resolved design tokens (ledger-live light theme) */
const COLORS = {
  surface: '#fafafa', // grey 100
  surfacePressed: '#e8e8e8', // grey 300
  footerBg: '#0000000d', // grey 950-5 (mutedTransparent)
  borderActive: '#d4a0ff', // purple 600
  textBase: '#000000', // grey 950
  textMuted: '#6a6a6a', // grey 700
  textDisabled: '#c1c1c1', // grey 500
} as const;

const SPACINGS = { s4: 4, s8: 8, s10: 10, s12: 12 } as const;
const RADIUS_LG = 16;
const BORDER_WIDTH = 2;
const TIMING = {
  duration: 300,
  easing: Easing.bezier(0.4, 0, 0.2, 1),
} as const;

const TYPOGRAPHY = {
  title: {
    fontFamily: 'Inter',
    fontSize: 14,
    fontWeight: '600',
    lineHeight: 20,
    letterSpacing: 0,
  },
  description: {
    fontFamily: 'Inter',
    fontSize: 12,
    fontWeight: '500',
    lineHeight: 16,
    letterSpacing: 0,
  },
} as const satisfies Record<string, TextStyle>;

type CardType = 'interactive' | 'expandable' | 'info';

type CardContextValue = {
  cardPressable: boolean;
  headerPressable: boolean;
  footerExpanded: boolean;
  disabled: boolean;
  onHeaderPress?: (event: GestureResponderEvent) => void;
};

type CardAlignContextValue = { align: 'left' | 'right' };

const CardContext = createContext<CardContextValue>({
  cardPressable: false,
  headerPressable: false,
  footerExpanded: true,
  disabled: false,
});

const CardAlignContext = createContext<CardAlignContextValue>({
  align: 'left',
});

const resolveCardInnerContext = ({
  type,
  expanded,
  onPress,
  disabled,
}: {
  type: CardType;
  expanded?: boolean;
  onPress?: (event: GestureResponderEvent) => void;
  disabled: boolean;
}): CardContextValue => {
  switch (type) {
    case 'interactive':
      return {
        cardPressable: !!onPress,
        headerPressable: false,
        footerExpanded: true,
        disabled,
        onHeaderPress: undefined,
      };
    case 'expandable':
      return {
        cardPressable: false,
        headerPressable: !!onPress && !disabled,
        footerExpanded: Boolean(expanded),
        disabled,
        onHeaderPress: onPress,
      };
    case 'info':
      return {
        cardPressable: false,
        headerPressable: false,
        footerExpanded: true,
        disabled,
        onHeaderPress: undefined,
      };
  }
};

const isTextChildren = (children: ReactNode): boolean => {
  if (typeof children === 'string' || typeof children === 'number') return true;
  if (Array.isArray(children)) {
    return children.every(
      (child) => typeof child === 'string' || typeof child === 'number',
    );
  }
  return !isValidElement(children);
};

export type CardProps = {
  /** @default 'interactive' */
  type?: CardType;
  /** Only relevant when `type="expandable"`. */
  expanded?: boolean;
  /** @default false */
  outlined?: boolean;
  /** @default false */
  disabled?: boolean;
  onPress?: (event: GestureResponderEvent) => void;
  children: ReactNode;
  style?: StyleProp<ViewStyle>;
};

export const Card = ({
  type = 'interactive',
  expanded,
  outlined = false,
  disabled = false,
  onPress,
  children,
  style,
}: CardProps) => {
  const innerContext = useMemo(
    () => resolveCardInnerContext({ type, expanded, onPress, disabled }),
    [type, expanded, onPress, disabled],
  );

  if (innerContext.cardPressable) {
    return (
      <CardContext.Provider value={innerContext}>
        <Pressable
          onPress={onPress}
          disabled={disabled}
          accessibilityRole='button'
          accessibilityState={{ disabled }}
          style={style}
        >
          {({ pressed }) => (
            <View
              style={[
                styles.container,
                outlined && styles.outlined,
                pressed && !disabled && styles.containerPressed,
              ]}
            >
              {children}
            </View>
          )}
        </Pressable>
      </CardContext.Provider>
    );
  }

  return (
    <CardContext.Provider value={innerContext}>
      <View style={style}>
        <View style={[styles.container, outlined && styles.outlined]}>
          {children}
        </View>
      </View>
    </CardContext.Provider>
  );
};

export const CardHeader = ({
  children,
  style,
}: {
  children: ReactNode;
  style?: StyleProp<ViewStyle>;
}) => {
  const { disabled, headerPressable, footerExpanded, onHeaderPress } =
    useContext(CardContext);

  if (headerPressable && onHeaderPress) {
    return (
      <Pressable
        onPress={onHeaderPress}
        disabled={disabled}
        accessibilityRole='button'
        accessibilityState={{ disabled, expanded: footerExpanded }}
        style={style}
      >
        {({ pressed }) => (
          <View style={[styles.header, pressed && styles.headerPressed]}>
            {children}
            <Chevron up={footerExpanded} />
          </View>
        )}
      </Pressable>
    );
  }

  return (
    <View style={style}>
      <View style={styles.header}>{children}</View>
    </View>
  );
};

export const CardLeading = ({
  children,
  style,
}: {
  children: ReactNode;
  style?: StyleProp<ViewStyle>;
}) => {
  return <View style={[styles.leading, style]}>{children}</View>;
};

export const CardContent = ({
  children,
  style,
}: {
  children: ReactNode;
  style?: StyleProp<ViewStyle>;
}) => {
  const { align } = useContext(CardAlignContext);
  const isTrailing = align === 'right';
  return (
    <View
      style={[
        styles.content,
        isTrailing ? styles.contentTrailing : styles.contentLeading,
        style,
      ]}
    >
      {children}
    </View>
  );
};

export const CardContentRow = ({
  children,
  style,
}: {
  children: ReactNode;
  style?: StyleProp<ViewStyle>;
}) => {
  const { align } = useContext(CardAlignContext);
  return (
    <View
      style={[
        styles.contentRow,
        align === 'right' && styles.contentRowRight,
        style,
      ]}
    >
      {children}
    </View>
  );
};

export const CardContentTitle = ({
  children,
  style,
}: {
  children: ReactNode;
  style?: StyleProp<TextStyle>;
}) => {
  const { disabled } = useContext(CardContext);
  const { align } = useContext(CardAlignContext);

  if (isTextChildren(children)) {
    return (
      <Text
        numberOfLines={1}
        ellipsizeMode='tail'
        style={[
          TYPOGRAPHY.title,
          {
            flexShrink: 1,
            color: disabled ? COLORS.textDisabled : COLORS.textBase,
            textAlign: align === 'right' ? 'right' : 'left',
          },
          style,
        ]}
      >
        {children}
      </Text>
    );
  }

  return (
    <View
      style={[
        styles.textAsBox,
        { justifyContent: align === 'right' ? 'flex-end' : 'flex-start' },
      ]}
    >
      {children}
    </View>
  );
};

export const CardContentDescription = ({
  children,
  style,
}: {
  children: ReactNode;
  style?: StyleProp<TextStyle>;
}) => {
  const { disabled } = useContext(CardContext);
  const { align } = useContext(CardAlignContext);

  if (isTextChildren(children)) {
    return (
      <Text
        numberOfLines={1}
        ellipsizeMode='tail'
        style={[
          TYPOGRAPHY.description,
          {
            flexShrink: 1,
            color: disabled ? COLORS.textDisabled : COLORS.textMuted,
            textAlign: align === 'right' ? 'right' : 'left',
          },
          style,
        ]}
      >
        {children}
      </Text>
    );
  }

  return (
    <View
      style={[
        styles.textAsBox,
        { justifyContent: align === 'right' ? 'flex-end' : 'flex-start' },
      ]}
    >
      {children}
    </View>
  );
};

export const CardTrailing = ({
  children,
  style,
}: {
  children: ReactNode;
  style?: StyleProp<ViewStyle>;
}) => {
  return (
    <CardAlignContext.Provider value={{ align: 'right' }}>
      <View style={[styles.trailing, style]}>{children}</View>
    </CardAlignContext.Provider>
  );
};

const useCardFooterAnimation = (
  footerExpanded: boolean,
): {
  onContentLayout: (event: LayoutChangeEvent) => void;
  animatedContainerStyle: ReturnType<typeof useAnimatedStyle>;
} => {
  const contentHeight = useSharedValue(0);

  const onContentLayout = useCallback(
    (event: LayoutChangeEvent) => {
      const height = event.nativeEvent.layout.height;
      if (height > 0) contentHeight.value = height;
    },
    [contentHeight],
  );

  // Reanimated best practice: derive the animation reactively by calling
  // `withTiming` inside `useAnimatedStyle`. When `footerExpanded` changes the
  // worklet re-runs and animates the progress -- no shared value / useEffect
  // driver required. `contentHeight` stays a shared value because it is fed by
  // the layout callback. The Animated.View wraps a real child so the height
  // update is applied on iOS New Architecture.
  const animatedContainerStyle = useAnimatedStyle(() => {
    const progress = withTiming(footerExpanded ? 1 : 0, TIMING);
    return {
      height:
        contentHeight.value > 0 ? progress * contentHeight.value : undefined,
      overflow: 'hidden',
    };
  }, [footerExpanded]);

  return { onContentLayout, animatedContainerStyle };
};

export const CardFooter = ({
  children,
  style,
}: {
  children: ReactNode;
  style?: StyleProp<ViewStyle>;
}) => {
  const { disabled, footerExpanded } = useContext(CardContext);
  const { onContentLayout, animatedContainerStyle } =
    useCardFooterAnimation(footerExpanded);

  return (
    <Animated.View style={[styles.footerWrapper, animatedContainerStyle]}>
      <View onLayout={onContentLayout}>
        <View
          style={[
            styles.footerContent,
            disabled && styles.footerDisabled,
            style,
          ]}
        >
          {children}
        </View>
      </View>
    </Animated.View>
  );
};

export const CardFooterActions = ({
  children,
  style,
}: {
  children: ReactNode;
  style?: StyleProp<ViewStyle>;
}) => {
  return <View style={[styles.footerActions, style]}>{children}</View>;
};

const Chevron = ({ up }: { up: boolean }) => {
  return (
    <Text
      style={styles.chevron}
      accessibilityElementsHidden
      importantForAccessibility='no'
    >
      {up ? '\u2303' : '\u2304'}
    </Text>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'column',
    width: '100%',
    overflow: 'hidden',
    borderRadius: RADIUS_LG,
    backgroundColor: COLORS.surface,
  },
  outlined: {
    borderWidth: BORDER_WIDTH,
    borderColor: COLORS.borderActive,
  },
  containerPressed: {
    backgroundColor: COLORS.surfacePressed,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACINGS.s12,
    padding: SPACINGS.s12,
  },
  headerPressed: {
    backgroundColor: COLORS.surfacePressed,
  },
  leading: {
    flex: 1,
    minWidth: 0,
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACINGS.s12,
  },
  content: {
    flexDirection: 'column',
    gap: SPACINGS.s4,
  },
  contentLeading: {
    flex: 1,
    minWidth: 0,
  },
  contentTrailing: {
    flexShrink: 1,
    minWidth: 0,
    alignItems: 'flex-end',
  },
  contentRow: {
    flexDirection: 'row',
    minWidth: 0,
    alignItems: 'center',
    gap: SPACINGS.s8,
  },
  contentRowRight: {
    justifyContent: 'flex-end',
  },
  textAsBox: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACINGS.s4,
    width: '100%',
  },
  trailing: {
    gap: SPACINGS.s12,
    flexDirection: 'row',
    alignItems: 'center',
  },
  footerWrapper: {
    backgroundColor: COLORS.footerBg,
  },
  footerContent: {
    width: '100%',
    flexDirection: 'column',
    gap: SPACINGS.s8,
    paddingHorizontal: SPACINGS.s12,
    paddingVertical: SPACINGS.s10,
  },
  footerDisabled: {
    opacity: 0.5,
  },
  footerActions: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    gap: SPACINGS.s10,
  },
  chevron: {
    color: COLORS.textMuted,
    fontSize: 20,
    lineHeight: 20,
  },
});
