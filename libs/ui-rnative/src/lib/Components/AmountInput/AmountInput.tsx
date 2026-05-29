import {
  getFontSize,
  textFormatter,
  useDisabledContext,
} from '@ledgerhq/lumen-utils-shared';
import { useEffect, useImperativeHandle, useRef, useState } from 'react';
import { Pressable, StyleSheet, TextInput, View } from 'react-native';
import Animated, {
  Easing,
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withSequence,
  withTiming,
} from 'react-native-reanimated';
import { useStyleSheet, useTheme } from '../../../styles';
import { Box } from '../Utility';
import {
  type AmountInputAlign,
  type AmountInputProps,
  type AmountInputSize,
} from './types';

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
  const inputValue = String(value);
  const [isFocused, setIsFocused] = useState(false);
  const disabled = useDisabledContext({
    consumerName: 'AmountInput',
    mergeWith: { disabled: disabledProp },
  });

  const translateX = useSharedValue(0);
  const animatedFontSize = useSharedValue(getFontSize(inputValue, size));
  const caretOpacity = useSharedValue(0);

  useImperativeHandle(ref, () => inputRef.current as TextInput, []);

  const { theme } = useTheme();
  const styles = useStyles({
    size,
    align,
    hasValue: !!inputValue,
    isEditable: !disabled,
    isInvalid,
  });
  const caretFixedHeight = size === 'sm' ? theme.sizes.s28 : 0;

  const animatedInputStyle = useAnimatedStyle(
    () => ({
      transform: [{ translateX: translateX.value }],
      fontSize: animatedFontSize.value,
      letterSpacing: 0,
    }),
    [translateX, animatedFontSize],
  );

  const animatedCurrencyStyle = useAnimatedStyle(
    () => ({
      fontSize: animatedFontSize.value,
      letterSpacing: 0,
    }),
    [animatedFontSize],
  );

  const animatedCaretStyle = useAnimatedStyle(
    () => ({
      opacity: caretOpacity.value,
      height: size === 'sm' ? caretFixedHeight : animatedFontSize.value,
    }),
    [caretOpacity, animatedFontSize, size, caretFixedHeight],
  );

  useEffect(() => {
    const newSize = getFontSize(inputValue, size);

    translateX.value = withSequence(
      withTiming(4, { duration: 0 }),
      withTiming(0, {
        duration: 250,
        easing: Easing.bezier(0.4, 0, 0.2, 1),
      }),
    );

    animatedFontSize.value = withTiming(newSize, {
      duration: 250,
      easing: Easing.bezier(0.4, 0, 0.2, 1),
    });
  }, [inputValue, size, animatedFontSize, translateX]);

  useEffect(() => {
    if (isFocused && !disabled) {
      caretOpacity.value = withRepeat(
        withSequence(
          withTiming(1, { duration: 150, easing: Easing.ease }),
          withTiming(1, { duration: 500 }),
          withTiming(0, { duration: 150, easing: Easing.ease }),
          withTiming(0, { duration: 500 }),
        ),
        -1,
        false,
      );
    } else {
      caretOpacity.value = 0;
    }
  }, [isFocused, disabled, caretOpacity]);

  const handleChangeText = (text: string) => {
    const formatted = textFormatter(text, {
      allowDecimals,
      thousandsSeparator,
      maxIntegerLength,
      maxDecimalLength,
    });

    onChangeText(formatted);
  };

  const CurrencyText = currencyText ? (
    <Animated.Text
      style={[styles.currency, animatedCurrencyStyle]}
      allowFontScaling={false}
    >
      {currencyText}
    </Animated.Text>
  ) : null;

  const handlePress = () => {
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
        value={inputValue}
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
          {currencyPosition === 'left' && CurrencyText}

          {/** display text that mirrors the hidden input's value */}
          <Animated.Text
            style={[styles.displayText, animatedInputStyle, style]}
            allowFontScaling={false}
          >
            {inputValue || '0'}
          </Animated.Text>

          {/** custom caret */}
          <Animated.View style={[styles.caret, animatedCaretStyle]} />

          {currencyPosition === 'right' && CurrencyText}
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
