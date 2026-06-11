/**
 * InlinedAmountDisplay
 *
 * A minimal, self-contained AmountDisplay (odometer-style animated amount).
 * Only depends on `react`, `react-native` and `react-native-reanimated`.
 * Design tokens are resolved to concrete light theme values (ledger-live) so no
 * theme provider is required, and the split-text / aria-label / pulse helpers
 * are inlined.
 */
import { memo, useEffect, useMemo } from 'react';
import type { ReactNode } from 'react';
import type { TextStyle, ViewProps } from 'react-native';
import { Platform, StyleSheet, Text, View } from 'react-native';
import Animated, {
  Easing,
  cancelAnimation,
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withTiming,
} from 'react-native-reanimated';

/* Resolved design tokens (ledger-live light theme) */
const COLORS = {
  textBase: '#000000', // grey 950
  textMuted: '#6a6a6a', // grey 700
} as const;

const SPACINGS = { s2: 2, s4: 4 } as const;

const ODOMETER_TIMING = {
  duration: 700,
  easing: Easing.bezier(0.4, 0, 0.2, 1), // easeInOut
} as const;

const PULSE_TIMING = {
  duration: 1000,
  easing: Easing.linear,
} as const;
const PULSE_MIN_OPACITY = 0.35;

const AMOUNT_HIDDEN_LABEL = 'Amount hidden';

/* Resolved typographies (ledger-live, md breakpoint) */
const TYPOGRAPHY = {
  heading1SemiBold: {
    fontFamily: 'Inter',
    fontSize: 40,
    fontWeight: '600',
    lineHeight: 48,
    letterSpacing: -2,
  },
  heading2SemiBold: {
    fontFamily: 'Inter',
    fontSize: 28,
    fontWeight: '600',
    lineHeight: 36,
    letterSpacing: -1.5,
  },
  heading4SemiBold: {
    fontFamily: 'Inter',
    fontSize: 20,
    fontWeight: '600',
    lineHeight: 28,
    letterSpacing: -1,
  },
} as const satisfies Record<string, TextStyle & { lineHeight: number }>;

/**
 * Per-digit measured widths for each typography. Glyphs are not monospaced, so
 * each digit reserves its own width to avoid horizontal jitter while animating.
 */
const TYPOGRAPHY_WIDTHS = {
  heading1SemiBold: {
    0: 25,
    1: 15.5,
    2: 23.5,
    3: 24.5,
    4: 25.5,
    5: 23.5,
    6: 25,
    7: 22,
    8: 24.5,
    9: 24.5,
  },
  heading2SemiBold: {
    0: 17.5,
    1: 11,
    2: 16.5,
    3: 17,
    4: 18,
    5: 16,
    6: 17.5,
    7: 15,
    8: 17,
    9: 17,
  },
  heading4SemiBold: {
    0: 13,
    1: 8.5,
    2: 12.5,
    3: 12.5,
    4: 13,
    5: 12,
    6: 12.5,
    7: 11.5,
    8: 12.5,
    9: 12.5,
  },
} as const;

const DIGITS = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9] as const;
type Digit = (typeof DIGITS)[number];

type MeasuredTypography = keyof typeof TYPOGRAPHY_WIDTHS;
type DigitWidths = Record<Digit, number>;

export type AmountDisplaySize = 'sm' | 'md';

export type FormattedValue = {
  integerPart: string;
  decimalPart?: string;
  currencyText: string;
  decimalSeparator: '.' | ',';
  currencyPosition: 'start' | 'end';
};

type SplitChar = {
  value: string;
  type: 'digit' | 'separator';
};

export type AmountDisplayProps = ViewProps & {
  value: number;
  formatter: (value: number) => FormattedValue;
  /** @default false */
  hidden?: boolean;
  /** @default false */
  loading?: boolean;
  /** @default true */
  animate?: boolean;
  /** @default 'md' */
  size?: AmountDisplaySize;
};

type SizeTypographyConfig = {
  integer: MeasuredTypography;
  decimal: MeasuredTypography;
};

const SIZE_TYPOGRAPHY: Record<AmountDisplaySize, SizeTypographyConfig> = {
  md: { integer: 'heading1SemiBold', decimal: 'heading2SemiBold' },
  sm: { integer: 'heading2SemiBold', decimal: 'heading4SemiBold' },
};

const useSplitText = (
  value: FormattedValue,
): { integerPart: SplitChar[]; decimalPart: SplitChar[] } => {
  return useMemo(
    () => ({
      integerPart: Array.from(value.integerPart, (digit) => ({
        value: digit,
        type: digit.match(/^\d$/) ? 'digit' : 'separator',
      })),
      decimalPart: value.decimalPart
        ? Array.from(value.decimalPart, (digit) => ({
            value: digit,
            type: 'digit' as const,
          }))
        : [],
    }),
    [value.integerPart, value.decimalPart],
  );
};

const buildAriaLabel = (parts: FormattedValue, hidden: boolean): string => {
  if (hidden) return AMOUNT_HIDDEN_LABEL;

  const decimal = parts.decimalPart
    ? `${parts.decimalSeparator}${parts.decimalPart}`
    : '';
  const amount = `${parts.integerPart}${decimal}`;

  if (parts.currencyPosition === 'end') {
    return `${amount} ${parts.currencyText}`;
  }
  return `${parts.currencyText} ${amount}`;
};

const Pulse = memo(
  ({
    children,
    animate,
    style,
    ...props
  }: ViewProps & { animate: boolean; children: ReactNode }) => {
    const sv = useSharedValue<number>(1);

    useEffect(() => {
      if (animate) {
        sv.value = withRepeat(
          withTiming(PULSE_MIN_OPACITY, PULSE_TIMING),
          -1,
          true,
        );
      } else {
        cancelAnimation(sv);
        sv.value = withTiming(1, PULSE_TIMING);
      }
      return () => {
        cancelAnimation(sv);
        sv.value = 1;
      };
    }, [sv, animate]);

    const animatedStyle = useAnimatedStyle(() => ({ opacity: sv.value }), [sv]);

    return (
      <Animated.View
        {...props}
        collapsable={false}
        style={[style, animatedStyle]}
      >
        {children}
      </Animated.View>
    );
  },
);
Pulse.displayName = 'Pulse';

const getStyles = (size: AmountDisplaySize) => {
  const typography = SIZE_TYPOGRAPHY[size];
  const integerTypo = TYPOGRAPHY[typography.integer];
  const decimalTypo = TYPOGRAPHY[typography.decimal];

  return StyleSheet.create({
    container: {
      flexDirection: 'row',
      alignItems: 'flex-end',
    },
    integerPartContainer: {
      flexDirection: 'row',
    },
    decimalPartContainer: {
      flexDirection: 'row',
      paddingBottom: SPACINGS.s2,
    },
    integerText: {
      ...integerTypo,
      color: COLORS.textBase,
    },
    decimalText: {
      ...decimalTypo,
      color: COLORS.textMuted,
    },
    spacingStart: {
      marginRight: SPACINGS.s4,
    },
    spacingEnd: {
      marginLeft: SPACINGS.s4,
    },
  });
};

// Horizontal breathing room for the clip box so glyphs that are slightly wider
// than the measured `targetWidth` are not cut on their left/right edges. RN has
// no per-axis overflow, so we extend the clip box horizontally while keeping the
// vertical clip tight to `lineHeight`.
const HORIZONTAL_CLIP_PADDING = 8;

// Reanimated best practice: derive the animation reactively by calling
// `withTiming` inside `useAnimatedStyle`. When `value`/`targetWidth` change the
// worklet re-runs and animates from the current value to the new target -- no
// shared value or useEffect driver required. Each Animated.View wraps real
// children so the updates apply on iOS New Architecture.
const useAnimatedDigitStrip = ({
  value,
  lineHeight,
  targetWidth,
  animate,
}: {
  value: Digit;
  lineHeight: number;
  targetWidth: number;
  animate: boolean;
}): {
  containerStyle: ReturnType<typeof useAnimatedStyle>;
  stripStyle: ReturnType<typeof useAnimatedStyle>;
} => {
  const containerStyle = useAnimatedStyle(
    () => ({
      width: animate ? withTiming(targetWidth, ODOMETER_TIMING) : targetWidth,
    }),
    [targetWidth, animate],
  );

  const stripStyle = useAnimatedStyle(
    () => ({
      transform: [
        {
          translateY: animate
            ? withTiming(-value * lineHeight, ODOMETER_TIMING)
            : -value * lineHeight,
        },
      ],
    }),
    [value, lineHeight, animate],
  );

  return { containerStyle, stripStyle };
};

type DigitStripProps = {
  value: Digit;
  animate: boolean;
  textStyle: TextStyle & { lineHeight: number };
  widths: DigitWidths;
};

const DigitStrip = memo(
  ({ value, textStyle, animate, widths }: DigitStripProps) => {
    const targetWidth = widths[value];
    const lineHeight = textStyle.lineHeight;
    const { containerStyle, stripStyle } = useAnimatedDigitStrip({
      value,
      lineHeight,
      targetWidth,
      animate,
    });

    return (
      <Animated.View
        style={[{ height: lineHeight }, containerStyle]}
        accessibilityValue={{ text: String(value) }}
      >
        <View
          pointerEvents='none'
          style={{
            position: 'absolute',
            top: 0,
            bottom: 0,
            left: -HORIZONTAL_CLIP_PADDING,
            right: -HORIZONTAL_CLIP_PADDING,
            overflow: 'hidden',
            alignItems: 'center',
          }}
        >
          <Animated.View style={[stripStyle, { alignItems: 'center' }]}>
            {DIGITS.map((d) => (
              <Text
                allowFontScaling={false}
                key={d}
                style={[
                  textStyle,
                  Platform.OS === 'android' && { height: lineHeight },
                ]}
              >
                {d}
              </Text>
            ))}
          </Animated.View>
        </View>
      </Animated.View>
    );
  },
);
DigitStrip.displayName = 'DigitStrip';

type DigitStripListProps = {
  items: SplitChar[];
  animate: boolean;
  textStyle: TextStyle & { lineHeight: number };
  widths: DigitWidths;
};

const DigitStripList = memo(
  ({ items, textStyle, animate, widths }: DigitStripListProps) => {
    return items.map((item, index) => {
      const key = items.length - index;
      if (item.type === 'separator') {
        return (
          <Text allowFontScaling={false} key={key} style={textStyle}>
            {item.value}
          </Text>
        );
      }
      return (
        <DigitStrip
          key={key}
          value={Number(item.value) as Digit}
          animate={animate}
          textStyle={textStyle}
          widths={widths}
        />
      );
    });
  },
);
DigitStripList.displayName = 'DigitStripList';

export const InlinedAmountDisplay = ({
  value,
  formatter,
  hidden = false,
  loading = false,
  animate = true,
  size = 'md',
  ...props
}: AmountDisplayProps) => {
  const styles = useMemo(() => getStyles(size), [size]);
  const parts = formatter(value);
  const splitDigits = useSplitText(parts);
  const ariaLabel = buildAriaLabel(parts, hidden);
  const typography = SIZE_TYPOGRAPHY[size];
  const integerWidths = TYPOGRAPHY_WIDTHS[typography.integer];
  const decimalWidths = TYPOGRAPHY_WIDTHS[typography.decimal];

  return (
    <View
      accessibilityLabel={ariaLabel}
      accessibilityState={{ busy: loading }}
      {...props}
    >
      <Pulse animate={loading}>
        <View
          style={styles.container}
          accessibilityElementsHidden
          importantForAccessibility='no-hide-descendants'
        >
          <View style={styles.integerPartContainer}>
            {parts.currencyPosition === 'start' && (
              <Text
                allowFontScaling={false}
                style={[styles.integerText, styles.spacingStart]}
              >
                {parts.currencyText}
              </Text>
            )}
            {hidden ? (
              <Text allowFontScaling={false} style={styles.integerText}>
                ••••
              </Text>
            ) : (
              <DigitStripList
                items={splitDigits.integerPart}
                textStyle={styles.integerText}
                animate={animate}
                widths={integerWidths}
              />
            )}
          </View>
          <View style={styles.decimalPartContainer}>
            {!hidden && parts.decimalPart && (
              <Text allowFontScaling={false} style={styles.decimalText}>
                {parts.decimalSeparator}
              </Text>
            )}
            {parts.decimalPart && !hidden && (
              <DigitStripList
                items={splitDigits.decimalPart}
                textStyle={styles.decimalText}
                animate={animate}
                widths={decimalWidths}
              />
            )}
            {parts.currencyPosition === 'end' && (
              <Text
                allowFontScaling={false}
                style={[styles.decimalText, styles.spacingEnd]}
              >
                {parts.currencyText}
              </Text>
            )}
          </View>
        </View>
      </Pulse>
    </View>
  );
};
