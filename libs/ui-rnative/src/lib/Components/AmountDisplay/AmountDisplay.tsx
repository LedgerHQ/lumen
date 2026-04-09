import { useSplitText, buildAriaLabel } from '@ledgerhq/lumen-utils-shared';
import { memo, useEffect } from 'react';
import { Text, View } from 'react-native';
import Animated, {
  SharedValue,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';
import { useCommonTranslation } from '../../../i18n';
import { useStyleSheet } from '../../../styles';
import { Pulse } from '../../Animations/Pulse';
import { useTimingConfig } from '../../Animations/useTimingConfig';
import { RuntimeConstants } from '../../utils';
import { Box } from '../Utility';
import {
  AmountDisplayProps,
  DigitStripListProps,
  DigitStripProps,
  DIGITS,
} from './types';

const INTEGER_DIGIT_WIDTHS = {
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
};

const DECIMAL_DIGIT_WIDTHS = {
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
};

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

const useAnimatedDigitStrip = ({
  value,
  lineHeight,
  targetWidth,
  width,
  animate,
}: {
  value: number;
  lineHeight: number;
  targetWidth: number;
  width: SharedValue<number>;
  animate: boolean;
}) => {
  const translateY = useSharedValue(-value * lineHeight);

  const timingConfig = useTimingConfig({
    duration: 700,
    easing: 'easeInOut',
  });

  useEffect(() => {
    if (animate) {
      translateY.value = withTiming(-value * lineHeight, timingConfig);
      width.value = withTiming(targetWidth, timingConfig);
    } else {
      translateY.value = -value * lineHeight;
      width.value = targetWidth;
    }
  }, [
    value,
    lineHeight,
    translateY,
    animate,
    width,
    targetWidth,
    timingConfig,
  ]);

  const animatedStyle = useAnimatedStyle(
    () => ({
      transform: [{ translateY: translateY.value }],
    }),
    [translateY],
  );

  return { animatedStyle };
};

const DigitStrip = memo(
  ({ value, textStyle, animate, type }: DigitStripProps) => {
    const targetWidth = (
      type === 'integer' ? INTEGER_DIGIT_WIDTHS : DECIMAL_DIGIT_WIDTHS
    )[value];
    const lineHeight = textStyle.lineHeight;
    const width = useSharedValue<number>(targetWidth);
    const { animatedStyle } = useAnimatedDigitStrip({
      value,
      lineHeight,
      targetWidth,
      width,
      animate,
    });

    return (
      <Animated.View
        style={{ height: lineHeight, overflow: 'hidden', width: width }}
        accessibilityValue={{ text: String(value) }}
      >
        <Animated.View style={[animatedStyle, { alignItems: 'center' }]}>
          {DIGITS.map((d) => (
            <Text
              allowFontScaling={false}
              key={d}
              style={[
                textStyle,
                RuntimeConstants.isAndroid && { height: lineHeight },
              ]}
            >
              {d}
            </Text>
          ))}
        </Animated.View>
      </Animated.View>
    );
  },
);
DigitStrip.displayName = 'DigitStrip';

const DigitStripList = memo(
  ({ items, textStyle, animate, type }: DigitStripListProps) => {
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
          value={Number(item.value) as DigitStripProps['value']}
          animate={animate}
          textStyle={textStyle}
          type={type}
        />
      );
    });
  },
);
DigitStripList.displayName = 'DigitStripList';

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
  const { t } = useCommonTranslation();
  const parts = formatter(value);
  const splitDigits = useSplitText(parts);
  const ariaLabel = buildAriaLabel(
    parts,
    hidden,
    t('components.amountDisplay.amountHiddenAriaLabel'),
  );

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
              <Text
                allowFontScaling={false}
                style={[styles.currencyStartText, styles.spacingStart]}
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
                type='integer'
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
                type='decimal'
              />
            )}
            {parts.currencyPosition === 'end' && (
              <Text
                allowFontScaling={false}
                style={[styles.currencyEndText, styles.spacingEnd]}
              >
                {parts.currencyText}
              </Text>
            )}
          </View>
        </View>
      </Pulse>
    </Box>
  );
};
