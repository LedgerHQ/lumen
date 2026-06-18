import { useDisabledContext } from '@ledgerhq/lumen-utils-shared';
import { useImperativeHandle, useRef, useState } from 'react';
import type { StyleProp, TextStyle } from 'react-native';
import { Pressable, StyleSheet, TextInput, View } from 'react-native';
import Animated from 'react-native-reanimated';
import { useStyleSheet } from '../../../styles';
import { Box } from '../Utility';
import type {
  AmountInputAlign,
  AmountInputProps,
  AmountInputSize,
} from './types';
import { useAmountInputAnimations } from './useAmountInputAnimations/useAmountInputAnimations';
import { useAmountInputFormatting } from './useAmountInputFormatting/useAmountInputFormatting';

type CurrencyProps = {
  style: StyleProp<TextStyle>;
  children: string;
};

const Currency = ({ style, children }: CurrencyProps) => (
  <Animated.Text style={style} allowFontScaling={false}>
    {children}
  </Animated.Text>
);

/**
 * AmountInput component for handling numeric input with currency display.
 * This is a controlled component - both `value` and `onChange` props are required.
 * The currency text can be positioned either on the left or right side of the input.
 */
export const AmountInput = ({
  lx = {},
  style,
  size = 'md',
  align = 'center',
  currencyText,
  currencyPosition = 'left',
  editable,
  disabled: disabledProp = false,
  maxIntegerLength = 9,
  maxDecimalLength = 9,
  allowDecimals = true,
  thousandsSeparator = true,
  value,
  onChangeText,
  isInvalid = false,
  ref,
  ...props
}: AmountInputProps) => {
  const inputRef = useRef<TextInput>(null);
  const [isFocused, setIsFocused] = useState(false);

  const disabled = useDisabledContext({
    consumerName: 'AmountInput',
    mergeWith: { disabled: disabledProp },
  });

  const { formattedValue, handleChangeText } = useAmountInputFormatting({
    value,
    onChangeText,
    formatOptions: {
      allowDecimals,
      thousandsSeparator,
      maxIntegerLength,
      maxDecimalLength,
    },
  });

  const { animatedInputStyle, animatedCurrencyStyle, animatedCaretStyle } =
    useAmountInputAnimations({
      formattedValue,
      size,
      isFocused,
      disabled,
    });

  const styles = useStyles({
    size,
    align,
    hasValue: !!formattedValue,
    isEditable: !disabled,
    isInvalid,
  });

  useImperativeHandle(ref, () => inputRef.current as TextInput, []);

  const handlePress = (): void => {
    if (!disabled) {
      inputRef.current?.focus();
    }
  };

  return (
    <Box lx={lx} style={styles.container}>
      {/** hidden text input because of flickering issue */}
      <TextInput
        ref={inputRef}
        keyboardType='decimal-pad'
        editable={editable !== false && !disabled}
        value={formattedValue}
        onChangeText={handleChangeText}
        onFocus={(e) => {
          setIsFocused(true);
          props.onFocus?.(e);
        }}
        onBlur={(e) => {
          setIsFocused(false);
          props.onBlur?.(e);
        }}
        style={styles.hiddenInput}
        {...props}
      />
      <View style={styles.alignRow}>
        <Pressable
          onPress={handlePress}
          style={styles.pressable}
          accessibilityLabel={props.accessibilityLabel || 'Amount input'}
        >
          {currencyText && currencyPosition === 'left' && (
            <Currency style={[styles.currency, animatedCurrencyStyle]}>
              {currencyText}
            </Currency>
          )}

          {/** display text that mirrors the hidden input's value */}
          <Animated.Text
            style={[styles.displayText, animatedInputStyle, style]}
            allowFontScaling={false}
          >
            {formattedValue || '0'}
          </Animated.Text>

          {/** custom caret */}
          <Animated.View style={[styles.caret, animatedCaretStyle]} />

          {currencyText && currencyPosition === 'right' && (
            <Currency style={[styles.currency, animatedCurrencyStyle]}>
              {currencyText}
            </Currency>
          )}
        </Pressable>
      </View>
    </Box>
  );
};

const SIZE_TYPOGRAPHY = {
  md: 'heading0SemiBold',
  sm: 'heading2SemiBold',
} as const satisfies Record<
  AmountInputSize,
  'heading0SemiBold' | 'heading2SemiBold'
>;

const ALIGN_ROW_JUSTIFY = {
  center: 'center',
  start: 'flex-start',
  end: 'flex-end',
} as const satisfies Record<
  AmountInputAlign,
  'center' | 'flex-start' | 'flex-end'
>;

const useStyles = ({
  size,
  align,
  hasValue,
  isEditable,
  isInvalid,
}: {
  size: AmountInputSize;
  align: AmountInputAlign;
  hasValue: boolean;
  isEditable: boolean;
  isInvalid: boolean;
}) => {
  return useStyleSheet(
    (t) => {
      const typography = t.typographies[SIZE_TYPOGRAPHY[size]];
      const displayHeight = size === 'md' ? t.sizes.s56 : t.sizes.s36;

      return {
        container: {
          position: 'relative',
          width: t.sizes.full,
        },
        hiddenInput: {
          position: 'absolute',
          width: t.sizes.full,
          height: t.sizes.full,
          opacity: 0,
        },
        alignRow: {
          width: t.sizes.full,
          flexDirection: 'row',
          justifyContent: ALIGN_ROW_JUSTIFY[align],
        },
        pressable: {
          flexDirection: 'row',
          alignItems: 'center',
        },
        displayText: StyleSheet.flatten([
          {
            height: displayHeight,
            backgroundColor: 'transparent',
            color: t.colors.text.base,
            alignItems: 'flex-start',
            ...typography,
          },
          !hasValue && {
            color: t.colors.text.mutedSubtle,
          },
          !isEditable && {
            color: t.colors.text.disabled,
          },
          isInvalid && {
            color: t.colors.text.error,
          },
        ]),
        currency: StyleSheet.flatten([
          {
            color: t.colors.text.base,
            ...typography,
          },
          !hasValue && {
            color: t.colors.text.mutedSubtle,
          },
          !isEditable && {
            color: t.colors.text.disabled,
          },
          isInvalid && {
            color: t.colors.text.error,
          },
        ]),
        caret: {
          marginHorizontal: t.spacings.s2,
          width: t.sizes.s2,
          backgroundColor: t.colors.text.active,
        },
      };
    },
    [size, align, hasValue, isEditable, isInvalid],
  );
};
