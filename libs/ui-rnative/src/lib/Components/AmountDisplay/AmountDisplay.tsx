import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useStyleSheet } from '../../../styles';
import { ViewRef } from '../../types';
import { AmountDisplayProps } from './types';

const useStyles = () => {
  return useStyleSheet(
    (t) => ({
      container: {
        flexDirection: 'row',
        alignItems: 'baseline',
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
export const AmountDisplay = React.forwardRef<ViewRef, AmountDisplayProps>(
  ({ value, formatter, hidden = false, style, ...props }, ref) => {
    const styles = useStyles();
    const parts = formatter(value);

    return (
      <View
        ref={ref}
        style={StyleSheet.flatten([styles.container, style])}
        {...props}
      >
        {(parts.currencyPosition === undefined ||
          parts.currencyPosition === 'start') && (
          <Text style={[styles.currencyStartText, styles.spacingStart]}>
            {parts.currencyText}
          </Text>
        )}
        <Text style={styles.integerText}>
          {hidden ? '••••' : parts.integerPart}
        </Text>
        {parts.decimalPart && !hidden && (
          <Text style={styles.decimalText}>
            {(parts.decimalSeparator || '.') + parts.decimalPart}
          </Text>
        )}
        {parts.currencyPosition === 'end' && (
          <Text style={[styles.currencyEndText, styles.spacingEnd]}>
            {parts.currencyText}
          </Text>
        )}
      </View>
    );
  },
);

AmountDisplay.displayName = 'AmountDisplay';
