import { useSplitText, buildAriaLabel } from '@ledgerhq/lumen-utils-shared';
import { memo, useEffect } from 'react';
import { Text, TextStyle, View } from 'react-native';
import Animated, {
  Easing,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';
import { useCommonTranslation } from '../../../i18n';
import { useStyleSheet, useTheme } from '../../../styles';
import { Pulse } from '../../Animations/Pulse';
import { Box } from '../Utility';
import { AmountDisplayProps, DigitStripProps, SplitChar } from './types';

const DIGITS = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9];

const INTEGER_DIGIT_WIDTHS = {
  0: 24.5,
  1: 15,
  2: 23,
  3: 23.5,
  4: 24.7,
  5: 22.6,
  6: 23.6,
  7: 21.1,
  8: 23.7,
  9: 23.6,
};

const DECIMAL_DIGIT_WIDTHS = {
  0: 17,
  1: 10.5,
  2: 16,
  3: 16.5,
  4: 17.2,
  5: 15.7,
  6: 16.5,
  7: 14.7,
  8: 16.5,
  9: 16.5,
};

const TIMING_CONFIG = {
  duration: 600,
  easing: Easing.inOut(Easing.ease),
};

const DigitStrip = memo(
  ({ value, lineHeight, textStyle, animate, type }: DigitStripProps) => {
    const targetWidth = (
      type === 'integer' ? INTEGER_DIGIT_WIDTHS : DECIMAL_DIGIT_WIDTHS
    )[value as keyof typeof INTEGER_DIGIT_WIDTHS];
    const translateY = useSharedValue(-value * lineHeight);
    const width = useSharedValue<number>(targetWidth);

    useEffect(() => {
      if (animate) {
        translateY.value = withTiming(-value * lineHeight, TIMING_CONFIG);
        width.value = withTiming(targetWidth, TIMING_CONFIG);
      } else {
        translateY.value = -value * lineHeight;
        width.value = targetWidth;
      }
    }, [value, lineHeight, translateY, animate, width, targetWidth]);

    const animatedStyle = useAnimatedStyle(
      () => ({
        transform: [{ translateY: translateY.value }],
      }),
      [translateY],
    );

    return (
      <Animated.View
        style={{ height: lineHeight, overflow: 'hidden', width: width }}
        accessibilityValue={{ text: String(value) }}
      >
        <Animated.View style={[animatedStyle, { alignItems: 'center' }]}>
          {DIGITS.map((d) => (
            <Text key={d} style={textStyle}>
              {d}
            </Text>
          ))}
        </Animated.View>
      </Animated.View>
    );
  },
);

const useStyles = () => {
  return useStyleSheet(
    (t) => ({
      container: {
        flexDirection: 'row',
        alignItems: 'flex-end',
      },
      integerPartContainer: {
        flexDirection: 'row',
      },
      decimalPartContainer: {
        flexDirection: 'row',
        paddingBottom: t.spacings.s2,
      },
      integerText: {
        ...t.typographies.heading1SemiBold,
        color: t.colors.text.base,
      },
      decimalText: {
        ...t.typographies.heading2SemiBold,
        color: t.colors.text.muted,
      },
      currencyStartText: {
        ...t.typographies.heading1SemiBold,
        color: t.colors.text.base,
      },
      currencyEndText: {
        ...t.typographies.heading2SemiBold,
        color: t.colors.text.muted,
      },
      spacingStart: {
        marginRight: t.spacings.s4,
      },
      spacingEnd: {
        marginLeft: t.spacings.s4,
      },
    }),
    [],
  );
};

/**
 * AmountDisplay - Renders formatted monetary amounts with flexible currency positioning and decimal formatting.
 *
 * This component uses a formatter function pattern that gives you full control over how amounts are displayed,
 * including currency position, decimal separators, and precision. Use the `hidden` prop for privacy features.
 *
 * @see {@link https://ldls.vercel.app/?path=/docs/communication-amountdisplay-overview--docs Storybook}
 * @see {@link https://ldls.vercel.app/?path=/docs/communication-amountdisplay-implementation--docs#dos-and-donts Guidelines}
 *
 * @example
 * ```tsx
 * import { AmountDisplay } from '@ledgerhq/lumen-ui-rnative';
 * import type { FormattedValue } from '@ledgerhq/lumen-ui-rnative';
 *
 * // Create a formatter function
 * const usdFormatter = (value: number): FormattedValue => {
 *   const [integerPart, decimalPart] = value.toFixed(2).split('.');
 *   return {
 *     integerPart,
 *     decimalPart,
 *     currencyText: '$',
 *     decimalSeparator: '.',
 *     currencyPosition: 'start',
 *   };
 * };
 *
 * // Basic usage
 * <AmountDisplay value={1234.56} formatter={usdFormatter} />
 *
 * // With privacy (hidden)
 * <AmountDisplay value={1234.56} formatter={usdFormatter} hidden={true} />
 * ```
 */
export const AmountDisplay = ({
  value,
  formatter,
  hidden = false,
  loading = false,
  animate = true,
  ...props
}: AmountDisplayProps) => {
  const styles = useStyles();
  const { theme } = useTheme();
  const { t } = useCommonTranslation();
  const parts = formatter(value);
  const splitDigits = useSplitText(parts);
  const ariaLabel = buildAriaLabel(
    parts,
    hidden,
    t('components.amountDisplay.amountHiddenAriaLabel'),
  );

  const integerLineHeight = theme.typographies.heading1SemiBold.lineHeight;
  const decimalLineHeight = theme.typographies.heading2SemiBold.lineHeight;

  const renderDigits = (
    items: SplitChar[],
    textStyle: TextStyle,
    lineHeight: number,
    type: 'integer' | 'decimal',
  ) => {
    return items.map((item, index) => {
      const key = items.length - index;
      if (item.type === 'separator') {
        return (
          <Text key={key} style={textStyle}>
            {item.value}
          </Text>
        );
      }
      return (
        <DigitStrip
          key={key}
          value={Number(item.value)}
          animate={animate}
          lineHeight={lineHeight}
          textStyle={textStyle}
          type={type}
        />
      );
    });
  };

  return (
    <Box
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
              <Text style={[styles.currencyStartText, styles.spacingStart]}>
                {parts.currencyText}
              </Text>
            )}
            {hidden ? (
              <Text style={styles.integerText}>••••</Text>
            ) : (
              renderDigits(
                splitDigits.integerPart,
                styles.integerText,
                integerLineHeight,
                'integer',
              )
            )}
          </View>
          <View style={styles.decimalPartContainer}>
            {!hidden && parts.decimalPart && (
              <Text style={styles.decimalText}>{parts.decimalSeparator}</Text>
            )}
            {parts.decimalPart &&
              !hidden &&
              renderDigits(
                splitDigits.decimalPart,
                styles.decimalText,
                decimalLineHeight,
                'decimal',
              )}
            {parts.currencyPosition === 'end' && (
              <Text style={[styles.currencyEndText, styles.spacingEnd]}>
                {parts.currencyText}
              </Text>
            )}
          </View>
        </View>
      </Pulse>
    </Box>
  );
};

AmountDisplay.displayName = 'AmountDisplay';
