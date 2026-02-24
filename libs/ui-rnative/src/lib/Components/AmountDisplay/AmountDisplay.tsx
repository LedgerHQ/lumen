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

const digits = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9];

const timingConfig = {
  duration: 600,
  easing: Easing.inOut(Easing.ease),
};

const DigitStrip = memo(
  ({ value, lineHeight, textStyle, animate }: DigitStripProps) => {
    const translateY = useSharedValue(-value * lineHeight);

    useEffect(() => {
      if (animate) {
        translateY.value = withTiming(-value * lineHeight, timingConfig);
      } else {
        translateY.value = -value * lineHeight;
      }
    }, [value, lineHeight, translateY, animate]);

    const animatedStyle = useAnimatedStyle(
      () => ({
        transform: [{ translateY: translateY.value }],
      }),
      [translateY],
    );

    return (
      <View
        style={{ height: lineHeight, overflow: 'hidden' }}
        accessibilityValue={{ text: String(value) }}
      >
        <Animated.View style={[animatedStyle, { alignItems: 'center' }]}>
          {digits.map((d) => (
            <Text key={d} style={textStyle}>
              {d}
            </Text>
          ))}
        </Animated.View>
      </View>
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
